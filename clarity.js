'use strict';
/* 3.5.2 — Presentation only. Existing balances, payments and storage keys are retained. */
(function(){
  const cents=n=>Math.round((Number(n)||0)*100),units=n=>n/100;
  const totalCents=(list,get)=>list.reduce((sum,x)=>sum+cents(get(x)),0);
  const movementDelta=m=>m.kind==='Egreso'?-cents(m.amount):cents(m.amount);
  const inPeriod=x=>Number(x.createdAt||0)>=latestCloseTime();
  function cashExplanation(){
    const s=cashSummary(),mov=data.movements.filter(inPeriod),payments=data.payments.filter(inPeriod);
    const collected=totalCents(payments,p=>p.amount);
    const contributions=totalCents(mov.filter(m=>m.kind==='Aporte a caja base'),m=>m.amount);
    const income=totalCents(mov.filter(m=>m.kind==='Ingreso'),m=>m.amount);
    const lent=totalCents(mov.filter(m=>m.kind==='Egreso'&&m.loanId),m=>m.amount);
    const expenses=totalCents(mov.filter(m=>m.kind==='Egreso'&&!m.loanId),m=>m.amount);
    const adjustmentIn=totalCents(mov.filter(m=>m.kind==='Ajuste'&&Number(m.amount)>0),m=>m.amount);
    const adjustmentOut=totalCents(mov.filter(m=>m.kind==='Ajuste'&&Number(m.amount)<0),m=>-Number(m.amount));
    const net=collected+mov.reduce((sum,m)=>sum+movementDelta(m),0);
    const last=[...data.closes].sort((a,b)=>Number(b.closedAt||0)-Number(a.closedAt||0))[0];
    const hasOpening=last&&last.cashBase!=null&&Number.isFinite(Number(last.cashBase));
    const opening=hasOpening?cents(last.cashBase):cents(s.base)-net;
    const reconciliation=cents(s.base)-opening-net;
    return {s,collected,contributions,income,lent,expenses,adjustmentIn,adjustmentOut,opening,reconciliation,
      incoming:collected+contributions+income+adjustmentIn,outgoing:lent+expenses+adjustmentOut,hasOpening};
  }
  window.miCarteraCashExplanation=cashExplanation;
  const line=(label,value,kind='',description='')=>`<div class="cash-line ${kind}"><div><span>${label}</span>${description?`<small>${description}</small>`:''}</div><b>${money(units(value))}</b></div>`;
  function calculation(x){return line('Saldo al inicio',x.opening,'',x.hasOpening?'Saldo guardado en el último cierre.':'Base anterior a los movimientos disponibles.')+
    line('+ Entradas',x.incoming,'cash-in','Cobros, aportes, otros ingresos y ajustes positivos.')+
    line('− Salidas',x.outgoing,'cash-out','Préstamos entregados, gastos y ajustes negativos.')+
    (x.reconciliation?line('Corrección de saldo',x.reconciliation,'cash-warning','Diferencia con el saldo guardado; revisa el historial y los ajustes.'): '')+
    line('= Dinero esperado en caja',cents(x.s.base),'cash-result','Saldo según tus registros. No es la ganancia.');}
  window.cashCloseMarkup=function(){const x=cashExplanation();return `<div class="cash-close-summary"><p class="sub">Vas a guardar este saldo y cerrar la caja de hoy.</p>${calculation(x)}<p class="sub">${x.s.count} cobro(s) registrados · ${money(units(x.collected))} recibidos de clientes.</p></div>${field('Notas del cierre','notes','','textarea',{full:true})}<div class="note">Compara el saldo esperado con el dinero que tienes. Esta app no cuenta el efectivo físico. Se permite un cierre por día y la caja reabre a las 00:00 del día siguiente.</div>`;};
  renderCash=function(){
    const x=cashExplanation(),s=x.s,closed=isDayClosed();
    const movements=data.movements.filter(inPeriod).slice().sort((a,b)=>Number(b.createdAt||0)-Number(a.createdAt||0));
    const closes=[...data.closes].sort((a,b)=>Number(b.closedAt||0)-Number(a.closedAt||0));
    const normal=normalLoans(),clavos=data.loans.filter(l=>l.isClavo);
    const debt=totalCents(normal,l=>balance(l)),clavoDebt=totalCents(clavos,l=>balance(l));
    $('#cash').innerHTML=section('Caja','Entiende tu saldo, paso a paso')+
      `<section class="cash-focus"><div class="rowtop"><span class="cash-eyebrow">DINERO ESPERADO EN CAJA</span><span class="pill ${closed?'amber':'green'}">${closed?'Cerrada':'Abierta'}</span></div><strong class="cash-balance ${s.base<0?'negative':''}" data-cash-balance>${money(s.base)}</strong><p>Es el saldo según tus registros. No es tu ganancia ni lo que falta por cobrar.</p><div class="cash-period">${closed?'Último cierre: ':'Movimientos desde: '}${esc(s.periodStart)}${closed?'<br>Reapertura: '+cashReopenLabel():''}</div></section>
      <section class="card cash-equation"><h3>¿De dónde sale este valor?</h3>${calculation(x)}</section>
      <div class="cash-actions">${btn('+ Registrar movimiento','add-movement','secondary')}${btn('+ Agregar dinero','add-base','secondary')}</div>
      <details class="cash-fold"><summary>Ver entradas y salidas en detalle</summary><div class="cash-fold-body"><h3>Dinero que entró</h3>${line('Cobros de clientes',x.collected,'cash-in',s.count+' abono(s); incluye capital e interés.')}${line('Dinero agregado por ti',x.contributions)}${line('Otros ingresos',x.income)}${line('Ajustes que aumentan Caja',x.adjustmentIn,'','Por ejemplo, anulación de un préstamo.')}<h3>Dinero que salió</h3>${line('Capital entregado en préstamos',x.lent,'cash-out','Es dinero prestado; no es un gasto operativo.')}${line('Gastos',x.expenses,'cash-out','Egresos registrados sin préstamo asociado.')}${line('Ajustes que disminuyen Caja',x.adjustmentOut,'','Correcciones, anulaciones de abonos o descuentos.')}<p class="sub">Estos valores corresponden al periodo indicado arriba; si no cerraste Caja, pueden abarcar varios días.</p></div></details>
      <details class="cash-fold"><summary>Dinero pendiente de cobrar</summary><div class="cash-fold-body"><p class="sub">Estas deudas todavía no son dinero disponible en Caja.</p>${line('Pendiente en Cartera',debt,'',normal.length+' crédito(s) en Cartera.')}${line('De ese saldo, cuotas atrasadas',cents(s.missing),'cash-warning','Ya está incluido en el pendiente de Cartera; no lo sumes otra vez.')}${line('Pendiente en Clavos',clavoDebt,'cash-warning',clavos.length+' crédito(s), separados de Cartera.')}</div></details>
      ${closed?'<button class="btn full cash-close" disabled>Caja cerrada por hoy</button>':btn('Revisar y cerrar caja','close-cash','primary full cash-close')}
      <details class="cash-fold"><summary>Movimientos del periodo <span>${movements.length}</span></summary><div class="cash-fold-body">${movements.length?movements.map(m=>{const delta=movementDelta(m);const label=m.kind==='Egreso'&&m.loanId?'Préstamo entregado':m.kind==='Egreso'?'Gasto':m.kind==='Ajuste'?'Ajuste de saldo':m.kind;return `<article class="cash-movement"><div class="rowtop"><div><b>${esc(m.concept||label)}</b><div class="sub">${esc(label)} · ${fmtDate(m.date)}</div></div><strong class="${delta<0?'red-val':'green-val'}">${delta<0?'−':'+'}${money(units(Math.abs(delta)))}</strong></div>${m.system||m.loanId?'':btn('Eliminar','delete-movement:'+m.id,'danger small')}</article>`}).join(''):empty('Sin movimientos','Los cobros de clientes se consultan en Cobros; aquí se muestran préstamos, gastos, ingresos y ajustes.')}</div></details>
      <details class="cash-fold"><summary>Historial de cierres <span>${closes.length}</span></summary><div class="cash-fold-body">${closes.length?closes.map(c=>`<details class="cash-history"><summary><span>${fmtDate(c.date)}<small>Saldo al cerrar</small></span><b>${c.cashBase!=null&&Number.isFinite(Number(c.cashBase))?money(c.cashBase):'No disponible'}</b></summary><div>${line('Cobrado a clientes',cents(c.collected),'cash-in')}${line('Ingresos y aportes',cents(c.income))}${c.loanCapital==null?'<p class="sub">Capital prestado: sin desglose guardado.</p>':line('Capital prestado',cents(c.loanCapital))}${line('Gastos',cents(c.expenses),'cash-out')}${line('Ajustes netos',cents(c.adjustments))}<p class="sub">${Number(c.count)||0} cobro(s) · ${Number(c.newClients)||0} cliente(s) nuevos.${c.loanCapital==null?' El cierre antiguo no guardó un desglose de capital prestado.':''}</p>${c.notes?`<p>${esc(c.notes)}</p>`:''}</div></details>`).join(''):empty('Sin cierres','El primer cierre aparecerá aquí.')}</div></details>`;
  };
  const collections=renderCollections;
  renderCollections=function(){
    collections();
    $('#collections')?.querySelectorAll('.workflow-loan').forEach((card,index)=>{
      const menu=card.querySelector('[data-action^="loan-menu:"]');
      const lid=menu?.dataset.action.slice('loan-menu:'.length),l=loan(lid);if(!l)return;
      const header=card.firstElementChild;
      const pay=card.querySelector('[data-action^="pay-loan:"]');
      const due=paymentSchedule(l).find(q=>Number(q.unpaid)>.005);
      if(card.classList.contains('workflow-paid')&&due){const sub=document.createElement('div');sub.className='sub';sub.textContent='Próxima cuota: '+fmtDate(due.date)+' · #'+due.number;header.firstElementChild.append(sub);}
      const panel=document.createElement('div');panel.className='collection-extra';panel.id='collection-extra-'+index;panel.hidden=true;
      if(pay){pay.remove();pay.textContent='Cobrar '+money(due?.unpaid||suggestedPayment(l));pay.className='btn primary collection-pay';}
      while(header.nextSibling)panel.append(header.nextSibling);
      const actions=document.createElement('div');actions.className='collection-actions';
      if(pay)actions.append(pay);else{const done=document.createElement('button');done.className='btn secondary';done.disabled=true;done.textContent='Crédito liquidado';actions.append(done);}
      const toggle=document.createElement('button');toggle.type='button';toggle.className='btn ghost collection-toggle';toggle.textContent='Expandir información';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls',panel.id);
      toggle.addEventListener('click',()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));toggle.textContent=panel.hidden?'Expandir información':'Ocultar información';});
      actions.append(toggle);card.append(actions,panel);
    });
  };
  render();
})();

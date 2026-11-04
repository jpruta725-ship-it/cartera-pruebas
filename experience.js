'use strict';
/* Mi Cartera 3.5.2: ayuda contextual y cálculos indexados solo durante cada render.
   No cambia claves, datos financieros ni formato de respaldo. */
(function(){
  let viewIndex=null;
  const originalPaid=paid,originalClient=client,originalLoan=loan;
  paid=function(lid){return viewIndex?(viewIndex.payments.get(lid)||0)/100:originalPaid(lid)};
  client=function(cid){return viewIndex?viewIndex.clients.get(cid):originalClient(cid)};
  loan=function(lid){return viewIndex?viewIndex.loans.get(lid):originalLoan(lid)};
  const indexed=fn=>function(...args){
    if(viewIndex)return fn.apply(this,args);
    const payments=new Map();
    for(const p of data.payments)payments.set(p.loanId,(payments.get(p.loanId)||0)+Math.round(Number(p.amount)*100));
    viewIndex={payments,clients:new Map(data.clients.map(c=>[c.id,c])),loans:new Map(data.loans.map(l=>[l.id,l]))};
    try{return fn.apply(this,args)}finally{viewIndex=null}
  };
  const guide=(title,body)=>`<details class="mc-guide"><summary>${title}<span>Ayuda</span></summary><div>${body}</div></details>`;
  const step=(n,title,body)=>`<div class="mc-step"><span>${n}</span><div><b>${title}</b><p>${body}</p></div></div>`;
  const overview=renderDashboard;
  renderDashboard=function(){
    overview();
    const root=$('#dashboard');if(!root)return;
    const active=normalLoans().filter(l=>balance(l)>.005),due=active.filter(l=>overdueAmount(l)>.005);
    const totalDebt=active.reduce((n,l)=>n+total(l),0),collected=active.reduce((n,l)=>n+paid(l.id),0);
    const progress=totalDebt?Math.min(100,Math.round(collected/totalDebt*100)):0;
    root.insertAdjacentHTML('afterbegin',`<section class="mc-overview"><div class="mc-overview-head"><div><span class="mc-kicker">TU JORNADA</span><h2>${isDayClosed()?'Caja cerrada por hoy':'Todo listo para cobrar'}</h2><p>${isDayClosed()?'Apertura automática: '+cashReopenLabel():`${active.length} créditos con saldo · ${due.length} con cuotas atrasadas`}</p></div><span class="mc-state ${isDayClosed()?'closed':''}">${isDayClosed()?'Cerrada':'Abierta'}</span></div><div class="mc-progress-label"><span>Recuperado de los créditos activos</span><b>${progress}%</b></div><div class="mc-progress" role="progressbar" aria-label="Recuperado de los créditos activos" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><i style="width:${progress}%"></i></div><div class="mc-shortcuts">${btn('⇄ Ir a Cobros','open-collections','primary')}${btn('+ Nuevo cliente','add-client','secondary')}${btn('▤ Nuevo crédito','add-loan','secondary')}</div></section>`+guide('Cómo usar Mi Cartera',step(1,'Registra al cliente','Guarda su nombre y, si quieres, teléfono, ubicación y documentos.')+step(2,'Crea su crédito','Indica capital, interés fijo y cuotas. El capital se descuenta de Caja.')+step(3,'Registra los abonos','Elige una o varias cuotas, o escribe un importe parcial. Cada crédito tiene su propio historial.')+step(4,'Cierra y respalda','Revisa Caja y guarda una copia de todas las rutas al terminar la jornada.')));
  };
  const collections=renderCollections;
  renderCollections=function(){
    collections();
    const root=$('#collections'),anchor=root?.querySelector('.workflow-payment-tabs');
    anchor?.insertAdjacentHTML('afterend',guide('Por pagar y Abonado hoy: ¿qué cambia?', '<p><b>Por pagar:</b> créditos con saldo que todavía no tienen un abono registrado hoy. Incluye cuotas futuras.</p><p><b>Abonado hoy:</b> créditos con al menos un abono registrado hoy; pueden conservar saldo pendiente. Puedes añadir otro abono o eliminar uno equivocado.</p><p>Las categorías de frecuencia y la búsqueda ayudan a encontrar cada crédito. Un abono parcial no equivale a una cuota completa.</p>'));
  };
  const settings=renderSettings;
  renderSettings=function(){settings();$('#settings')?.insertAdjacentHTML('afterbegin',`<section class="mc-overview mc-release"><span class="mc-kicker">MI CARTERA · 3.5.2</span><h2>Caja clara y cobros compactos</h2><p>Saldo de Caja explicado, detalles de Cobros desplegables y colores oscuros.</p>${btn('Revisar mis datos','open-integrity','secondary')}</section>`)};
  renderDashboard=indexed(renderDashboard);renderClients=indexed(renderClients);renderLoans=indexed(renderLoans);
  renderCollections=indexed(renderCollections);renderCash=indexed(renderCash);renderCharts=indexed(renderCharts);renderSettings=indexed(renderSettings);
  // Conserva la guía desplegada al buscar o cambiar categorías.
  const renderWithGuide=renderCollections;
  renderCollections=function(){const opened=$('#collections .mc-guide')?.open;renderWithGuide();if(opened){const guide=$('#collections .mc-guide');if(guide)guide.open=true}};
  // Modales utilizables con teclado y lectores de pantalla.
  let previousFocus=null;
  const modal=openModal,close=closeModal;
  openModal=function(...args){previousFocus=document.activeElement;modal(...args);const dialog=$('.modal'),heading=$('.modalhead h2');if(heading){heading.id='mc-modal-title';dialog?.setAttribute('aria-labelledby',heading.id)}const target=$('.modal .xbtn');target?.focus({preventScroll:true})};
  closeModal=function(){close();if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});previousFocus=null};
  document.addEventListener('keydown',event=>{
    const dialog=$('.modal');if(!dialog||document.body.classList.contains('mc-locked'))return;
    if(event.key==='Escape'&&$('#activeForm')?.dataset.busy!=='1'){event.preventDefault();closeModal();return}
    if(event.key!=='Tab')return;
    const controls=[...dialog.querySelectorAll('button,input,select,textarea,a[href],summary,[tabindex="0"]')].filter(el=>!el.disabled&&el.getClientRects().length);
    const first=controls[0],last=controls.at(-1);if(!first)return;
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  });
  if($('#quickFab'))$('#quickFab').textContent='+';
  render();
})();

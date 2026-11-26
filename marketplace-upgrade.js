(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const pageLinks=[['صفحه اصلی','index.html'],['خانه','index.html'],['سایت‌ساز آنلاین','site-builder.html'],['دستیار هوشمند','ai-assistant.html'],['خدمات','services.html'],['طراحی سایت','services.html'],['نمونه‌کارها','portfolio.html'],['تعرفه‌ها','pricing.html'],['قیمت','calculator.html'],['محاسبه قیمت','calculator.html'],['ثبت سفارش','order.html'],['سفارش','order.html'],['پیگیری سفارش','tracking.html'],['پیگیری','tracking.html'],['پروفایل','account.html'],['حساب کاربری','account.html'],['ورود','auth.html'],['ابزارها','tools.html'],['مقالات','articles.html'],['وبلاگ','blog.html'],['پرسش‌های متداول','faq.html'],['سوالات','faq.html'],['مقایسه','compare.html'],['مشاوره','consultation.html'],['تماس','contact.html'],['پشتیبانی','tickets.html'],['تیکت','tickets.html']];
function addSearch(){
 const nav=$('.nav'),actions=nav&&$('.actions',nav);if(!nav||!actions||$('.market-search',nav))return;
 const wrap=document.createElement('form');wrap.className='market-search';wrap.setAttribute('role','search');
 const input=document.createElement('input');input.type='search';input.placeholder='جست‌وجوی بخش‌های سایت…';input.setAttribute('aria-label','جست‌وجوی بخش‌های سایت');input.maxLength=60;
 const button=document.createElement('button');button.type='submit';button.textContent='بگرد';
 wrap.append(input,button);wrap.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim().toLocaleLowerCase('fa');if(!q)return;const found=pageLinks.find(x=>x[0].toLocaleLowerCase('fa').includes(q));if(found)location.href=found[1];else{const target=document.querySelector('main,section');if(target){target.scrollIntoView({behavior:'smooth'});input.value='';input.placeholder='بخش موردنظر پیدا نشد';}}});
 nav.insertBefore(wrap,actions);
}

function addHeaderAccountMenu(){
 const nav=$('.nav'),actions=nav&&$('.actions',nav);
 if(!actions||$('.market-account-menu',actions))return;
 const legacyMenu=$('.profile-menu',actions);if(legacyMenu)legacyMenu.remove();

 const authLink=$('#authLink',actions);
 const accountLink=$('#accountLink',actions);
 const themeButton=$('#themeButton',actions);

 if(accountLink){
  accountLink.href='order.html';
  accountLink.textContent='ثبت سفارش';
  accountLink.setAttribute('aria-label','ثبت سفارش جدید');
 }

 const menu=document.createElement('details');
 menu.className='market-account-menu';
 const summary=document.createElement('summary');
 summary.innerHTML='<span class="market-account-avatar" aria-hidden="true">👤</span><span class="market-account-label">حساب کاربری</span><span class="market-account-chevron" aria-hidden="true">⌄</span>';
 const list=document.createElement('div');
 list.className='market-account-panel';
 list.setAttribute('aria-label','منوی حساب کاربری');

 const heading=document.createElement('strong');
 heading.className='market-account-heading';
 heading.textContent='حساب کاربری من';
 list.append(heading);

 if(authLink){
  authLink.classList.remove('btn','small','ghost');
  authLink.classList.add('market-account-login');
  list.append(authLink);
 }else{
  const login=document.createElement('a');
  login.href='auth.html';login.className='market-account-login';login.textContent='ورود / ثبت‌نام';
  list.append(login);
 }

 const links=[
  ['پروفایل من','account.html','♙'],
  ['سفارش‌های من','account.html#ordersList','▤'],
  ['پیگیری سفارش','tracking.html','⌕'],
  ['تیکت‌های پشتیبانی','tickets.html','؟'],
  ['تنظیمات حساب','account.html#profileSettings','⚙'],
  ['امنیت حساب','account.html#securitySettings','◈'],
  ['اعلان‌ها','account.html#notificationsList','♢']
 ];
 const divider=document.createElement('span');divider.className='market-account-divider';list.append(divider);
 links.forEach(([label,href,icon])=>{
  const a=document.createElement('a');a.href=href;a.className='market-account-link';
  const glyph=document.createElement('span');glyph.setAttribute('aria-hidden','true');glyph.textContent=icon;
  const text=document.createElement('span');text.textContent=label;
  a.append(glyph,text);list.append(a);
 });

 if(themeButton){
  const theme=document.createElement('button');
  theme.type='button';theme.className='market-account-link market-account-theme';
  theme.innerHTML='<span aria-hidden="true">◐</span><span>تغییر پوسته سایت</span>';
  theme.addEventListener('click',()=>{themeButton.click();menu.open=false;});
  list.append(theme);
 }

 menu.append(summary,list);
 if(authLink)actions.insertBefore(menu,authLink);else actions.insertBefore(menu,actions.firstChild);
 if(accountLink){
  const orders=document.createElement('a');
  orders.href='account.html#ordersList';
  orders.className='market-orders-shortcut';
  orders.setAttribute('aria-label','مشاهده سفارش‌های من');
  orders.innerHTML='<span aria-hidden="true">▤</span><span>سفارش‌ها</span>';
  actions.insertBefore(orders,accountLink);
 }
 if(authLink)list.insertBefore(authLink,divider);
 document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false;});
 document.addEventListener('keydown',event=>{if(event.key==='Escape')menu.open=false;});
}

function addCategoryBar(){
 if($('.market-category-bar'))return;
 const header=$('header');if(!header||!$('.nav',header))return;
 const groups=[
  {title:'طراحی وب‌سایت',icon:'▣',links:[['سایت‌ساز آنلاین','site-builder.html'],['دستیار هوشمند انتخاب خدمات','ai-assistant.html'],['طراحی سایت فروشگاهی','services.html'],['طراحی سایت شرکتی','services.html'],['طراحی سایت شخصی','services.html'],['نمونه‌کارهای طراحی','portfolio.html'],['خدمات طراحی سایت','services.html']]},
  {title:'سفارش و حساب کاربری',icon:'◉',links:[['ثبت سفارش جدید','order.html'],['پیگیری سفارش','tracking.html'],['پروفایل مشتری','account.html'],['مقایسه پلن‌ها','compare.html'],['تعرفه خدمات','pricing.html']]},
  {title:'مشاوره و ابزارها',icon:'◇',links:[['درخواست مشاوره','consultation.html'],['محاسبه قیمت','calculator.html'],['ابزارهای آنلاین','tools.html'],['مقالات آموزشی','articles.html'],['وبلاگ','blog.html']]},
  {title:'راهنما و پشتیبانی',icon:'؟',links:[['پشتیبانی و ثبت تیکت','tickets.html'],['سؤالات متداول','faq.html'],['تماس با ما','contact.html'],['قوانین و شرایط','terms.html'],['حریم خصوصی','privacy.html']]}
 ];
 const quick=[['سایت‌ساز آنلاین','site-builder.html'],['دستیار هوشمند','ai-assistant.html'],['پیشنهاد پلن‌ها','pricing.html'],['نمونه‌کارها','portfolio.html'],['ثبت سفارش','order.html'],['پشتیبانی','tickets.html']];
 const nav=document.createElement('nav');nav.className='market-category-bar';nav.setAttribute('aria-label','منوی اصلی سایت');
 const trigger=document.createElement('button');trigger.type='button';trigger.className='market-menu-trigger';trigger.setAttribute('aria-expanded','false');trigger.innerHTML='<span aria-hidden="true">☰</span> دسته‌بندی خدمات <span aria-hidden="true">⌄</span>';
 const panel=document.createElement('div');panel.className='market-mega-menu';panel.hidden=true;
 const rail=document.createElement('div');rail.className='market-mega-rail';rail.setAttribute('role','tablist');rail.setAttribute('aria-label','دسته‌بندی خدمات');
 const content=document.createElement('div');content.className='market-mega-content';
 function showGroup(index){
  rail.querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-selected',String(i===index))});
  content.replaceChildren();
  const group=groups[index];const heading=document.createElement('h3');heading.textContent=group.title;content.append(heading);
  const list=document.createElement('div');list.className='market-mega-links';
  group.links.forEach(([label,href])=>{const a=document.createElement('a');a.href=href;a.textContent=label;list.append(a)});
  content.append(list);
 }
 groups.forEach((group,i)=>{const b=document.createElement('button');b.type='button';b.textContent=group.icon+'  '+group.title;b.setAttribute('role','tab');b.setAttribute('aria-selected',String(i===0));b.addEventListener('mouseenter',()=>showGroup(i));b.addEventListener('focus',()=>showGroup(i));b.addEventListener('click',()=>showGroup(i));rail.append(b)});
 panel.append(rail,content);showGroup(0);
 trigger.addEventListener('click',()=>{const open=panel.hidden;panel.hidden=!open;trigger.setAttribute('aria-expanded',String(open))});
 document.addEventListener('click',e=>{if(!nav.contains(e.target)){panel.hidden=true;trigger.setAttribute('aria-expanded','false')}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){panel.hidden=true;trigger.setAttribute('aria-expanded','false')}});
 nav.append(trigger,panel);
 quick.forEach(([label,href])=>{const a=document.createElement('a');a.href=href;a.textContent=label;if(location.pathname.endsWith('/'+href)||location.pathname===href)a.setAttribute('aria-current','page');nav.append(a)});
 header.after(nav);
}
function enhancePortfolio(){
 const section=[...document.querySelectorAll('section')].find(s=>s.querySelector('.portfolio')&&s.querySelector('h2'));
 if(!section||$('.market-filter',section))return;
 const grids=[...section.querySelectorAll('.cards')];const cards=grids.flatMap(g=>[...g.children]).filter(c=>c.matches('.card,.portfolio'));
 if(!cards.length)return;
 const bar=document.createElement('div');bar.className='market-filter';
 const input=document.createElement('input');input.type='search';input.placeholder='جست‌وجوی نمونه‌کار…';input.setAttribute('aria-label','جست‌وجوی نمونه‌کار');
 const filters=document.createElement('div');filters.className='market-filter';
 const categories=['همه','فروشگاهی','شرکتی','شخصی'];
 let active='همه';
 function apply(){let count=0;cards.forEach(card=>{const txt=card.textContent.toLocaleLowerCase('fa');const q=input.value.trim().toLocaleLowerCase('fa');const cat=active==='همه'||(active==='فروشگاهی'&&/فروشگاه|محصول|آوید/.test(txt))||(active==='شرکتی'&&/شرکتی|کسب.?وکار|business/.test(txt))||(active==='شخصی'&&/شخصی|مهارت|personal/.test(txt));const show=cat&&(!q||txt.includes(q));card.hidden=!show;if(show)count++;});let empty=$('.market-empty',section);if(!count){if(!empty){empty=document.createElement('div');empty.className='market-empty';empty.textContent='نمونه‌کاری با این جست‌وجو پیدا نشد.';grids[0]?.after(empty)}}else empty?.remove();}
 categories.forEach(cat=>{const b=document.createElement('button');b.type='button';b.textContent=cat;b.setAttribute('aria-pressed',String(cat===active));b.addEventListener('click',()=>{active=cat;filters.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));apply()});filters.append(b)});
 bar.append(input);input.addEventListener('input',apply);section.querySelector('.section-head')?.after(bar,filters);apply();
}
function addPlanComparison(){
 const grid=$('.pricing-grid');if(!grid||$('.market-compare'))return;
 const box=document.createElement('section');box.className='market-compare';box.innerHTML='<h3>مقایسه امکانات پلن‌ها</h3><p>قیمت نهایی پس از بررسی نیازهای پروژه اعلام می‌شود؛ موارد اختصاصی در پیش‌فاکتور مشخص خواهند شد.</p><div class="table-scroll"><table><thead><tr><th>امکانات</th><th>شخصی</th><th>شرکتی</th><th>فروشگاهی</th></tr></thead><tbody><tr><td>طراحی واکنش‌گرا</td><td class="yes">✓</td><td class="yes">✓</td><td class="yes">✓</td></tr><tr><td>صفحات معرفی</td><td class="yes">✓</td><td class="yes">✓</td><td class="yes">✓</td></tr><tr><td>نمونه‌کار / خدمات</td><td class="yes">✓</td><td class="yes">✓</td><td class="yes">✓</td></tr><tr><td>دسته‌بندی و صفحه محصول</td><td>—</td><td>—</td><td class="yes">✓</td></tr><tr><td>فرم درخواست</td><td class="maybe">سفارشی</td><td class="yes">✓</td><td class="yes">✓</td></tr><tr><td>اتصال درگاه پرداخت</td><td>—</td><td class="maybe">در صورت نیاز</td><td class="maybe">نیازمند قرارداد و درگاه</td></tr><tr><td>سئو پایه</td><td class="maybe">پایه</td><td class="yes">✓</td><td class="yes">✓</td></tr><tr><td>امکانات اختصاصی</td><td class="maybe">قابل سفارش</td><td class="maybe">قابل سفارش</td><td class="maybe">قابل سفارش</td></tr></tbody></table></div><p style="margin-top:12px">توجه: این جدول مقایسه سطح خدمات است، نه تعهد فنی یا قیمت قطعی. دامنه، میزبانی و سرویس‌های جانبی جداگانه بررسی می‌شوند.</p>';
 grid.after(box);
}
async function addProjectProgress(){
 const host=$('#ordersList');if(!host||$('.market-progress'))return;
 const card=document.createElement('section');card.className='market-progress';card.innerHTML='<h3>مسیر پیشرفت پروژه‌های من</h3><p>وضعیت سفارش‌های متصل به حساب شما به‌صورت زنده از حساب کاربری دریافت می‌شود.</p><div class="market-progress-content"><small>در حال دریافت وضعیت پروژه‌ها…</small></div>';
 host.parentElement?.insertBefore(card,host);
 try{
 const cfg=window.supabase?.createClient;if(!cfg)throw new Error('Supabase در دسترس نیست');
 const db=cfg('https://oczpjbwwogsydzkouxtj.supabase.co','sb_publishable_MS-mpTamnXY57k8pIllgVA_rRpqAEQ0');
 const {data:{user},error:authErr}=await db.auth.getUser();if(authErr||!user)throw new Error('برای مشاهده پیشرفت پروژه وارد حساب شوید.');
 const {data,error}=await db.from('orders').select('id,site_type,status,created_at,tracking_code').eq('user_id',user.id).order('created_at',{ascending:false}).limit(20);
 if(error)throw error;const target=$('.market-progress-content',card);target.replaceChildren();
 if(!data?.length){target.textContent='هنوز سفارشی برای این حساب ثبت نشده است.';return}
 const stages=['new','reviewing','in_progress','completed'],labels={new:'ثبت درخواست',reviewing:'بررسی نیازها',in_progress:'طراحی و اجرا',completed:'تحویل پروژه'};
 data.forEach(o=>{const index=Math.max(0,stages.indexOf(o.status));const item=document.createElement('div');item.className='market-progress-item';const head=document.createElement('div');head.className='market-progress-head';const name=document.createElement('span');name.textContent=(o.site_type||'پروژه طراحی سایت')+' · #'+o.id;const status=document.createElement('span');status.textContent=labels[o.status]||'در انتظار بررسی';head.append(name,status);const track=document.createElement('div');track.className='market-progress-track';const fill=document.createElement('div');fill.className='market-progress-fill';fill.style.width=((index+1)*25)+'%';track.append(fill);const small=document.createElement('small');small.textContent='ثبت‌شده در '+new Date(o.created_at).toLocaleDateString('fa-IR')+(o.tracking_code?' · کد پیگیری: '+o.tracking_code:'');item.append(head,track,small);target.append(item)});
 }catch(e){const target=$('.market-progress-content',card);target.textContent=e.message||'دریافت وضعیت پروژه ممکن نشد.'}
}
document.addEventListener('DOMContentLoaded',()=>{addHeaderAccountMenu();addSearch();addCategoryBar();enhancePortfolio();addPlanComparison();addProjectProgress()});
})();
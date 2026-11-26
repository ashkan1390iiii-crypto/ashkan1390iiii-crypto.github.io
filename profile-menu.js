(()=>{'use strict';
const actions=document.querySelector('.nav .actions');
const theme=document.getElementById('themeButton');
if(!actions||!theme||document.getElementById('profileMenu'))return;
const menu=document.createElement('details');menu.className='profile-menu';menu.id='profileMenu';
const summary=document.createElement('summary');summary.setAttribute('aria-label','باز کردن منوی پروفایل');summary.title='منوی پروفایل';
const icon=document.createElement('span');icon.className='profile-menu-icon';icon.setAttribute('aria-hidden','true');
for(let i=0;i<3;i++)icon.append(document.createElement('i'));
summary.append(icon);menu.append(summary);
const list=document.createElement('div');list.className='profile-menu-list';
const links=[
 ['👤 پروفایل و حساب کاربری','account.html'],
 ['📦 سفارش‌های من','account.html#ordersList'],
 ['⚖️ مقایسه پلن‌ها','compare.html'],
 ['🎫 تیکت‌های پشتیبانی','tickets.html'],
 ['🔎 پیگیری سفارش','tracking.html'],
 ['📝 ثبت سفارش جدید','order.html']
];
for(const [label,href] of links){const a=document.createElement('a');a.textContent=label;a.href=href;list.append(a)}
menu.append(list);actions.insertBefore(menu,theme);
document.addEventListener('click',e=>{if(!menu.contains(e.target))menu.open=false});
document.addEventListener('keydown',e=>{if(e.key==='Escape')menu.open=false});
})();
"use strict";let restaurant,reviews;var map;window.initMap=(()=>{const e=document.createElement("img"),t="/img/webp/maps-";e.srcset=`${t}360.webp 360w, ${t}500.webp 500w, ${t}700.webp 700w, ${t}900.webp 900w, ${t}1200.webp 1200w, ${t}1600.webp 1600w`,e.alt="Google Maps Preview";const n=document.getElementById("map");n.appendChild(e),fetchRestaurantFromURL((e,t)=>{e?console.error(e):n.addEventListener("click",e=>{self.map=new google.maps.Map(n,{zoom:16,center:t.latlng,scrollwheel:!1});google.maps.event.addListenerOnce(self.map,"idle",()=>{let e=document.querySelector("iframe");e.setAttribute("aria-hidden","true"),e.setAttribute("tabindex","-1")});DBHelper.mapMarkerForRestaurant(self.restaurant,self.map)}),fillBreadcrumb()})});const fetchRestaurantFromURL=async e=>{if(self.restaurant)return console.log("fetchRestaurantFromURL: restaurant already fetched!"),void e(null,self.restaurant);const t=getParameterByName("id");t?(await DBHelper.fetchRestaurantById(t,(t,n)=>{self.restaurant=n,n?e(null,n):console.error(t)}),await DBHelper.fetchRestaurantReviewsById(self.restaurant.id,(e,t)=>{t?self.reviews=t:console.error(e)}),fillRestaurantHTML()):(error="No restaurant id in URL",e(error,null))},fillRestaurantHTML=(e=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=e.name,console.log(self.restaurant.is_favorite);const t=document.querySelector("#favorite"),n=document.createElement("button"),r=document.createElement("p");r.innerHTML="click to change favorite state",n.innerHTML=self.restaurant.is_favorite?`${String.fromCodePoint(127775)} This is a favorite`:`${String.fromCodePoint(9723)} No favorite of yours`,n.addEventListener("click",async()=>{try{await fetch(`http://localhost:1337/restaurants/${e.id}/?is_favorite=${!e.is_favorite}`,{method:"PUT",headers:{Accept:"application/json"}}),self.restaurant.is_favorite=!e.is_favorite,t.removeChild(n),t.removeChild(r),fillRestaurantHTML(self.restaurant)}catch(t){console.error("You are offline, saving data to storage ",t),window.localStorage.setItem(`favoriteJson?id=${e.id}`,JSON.stringify({id:e.id,favorite:e.is_favorite})),window.addEventListener("online",()=>{console.log("You are online sending data to server"),window.localStorage.getItem(`favoriteJson?id=${e.id}`,(e,{id:t,favorite:n})=>{e&&console.error("error getting the stored data back ",e),fetch(`http://localhost:1337/restaurants/${t}/?is_favorite=${!n}`,{method:"PUT",headers:{Accept:"application/json"}})})})}}),t.appendChild(n),t.appendChild(r),document.getElementById("restaurant-address").innerHTML=e.address;const a=document.getElementById("restaurant-img"),i=document.getElementById("restaurant-figcap");a.className="restaurant-img",a.src=DBHelper.imageUrlForRestaurant(e),a.alt=`An impression of restaurant ${e.name}`,i.innerHTML=`Restaurant ${e.name}`;const s=a.src.slice(0,-17);a.srcset=`${s}-250_small-min.webp 250w,\n                  ${s}-400_medium-min.webp 400w,\n                  ${s}-600_large-min.webp 600w,\n                  ${s}-800_orig-min.webp 800w\n                  `,a.sizes="90vw",document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&fillRestaurantHoursHTML(),fillReviewsHTML()},fillRestaurantHoursHTML=(e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const r=document.createElement("tr"),a=document.createElement("td");a.innerHTML=n,r.appendChild(a);const i=document.createElement("td");i.innerHTML=e[n],r.appendChild(i),t.appendChild(r)}},fillReviewsHTML=(e=self.reviews)=>{const t=document.getElementById("reviews-container");if(t.childNodes.length<4){const e=document.createElement("h2");e.innerHTML="Reviews",t.appendChild(e)}if(!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const n=document.getElementById("reviews-list");e.forEach(e=>{n.appendChild(createReviewHTML(e))});const r=document.createElement("form");r.setAttribute("method","post"),r.setAttribute("action","http://localhost:1337/reviews"),r.onsubmit=(e=>{e.preventDefault();const t={};for(let n=0;n<4;n++)t[e.target[n].name]=e.target[n].value;fetch("http://localhost:1337/reviews",{method:"POST",newReviewRequest:t}),n.insertBefore(createReviewHTML(t),n.childNodes[n.childNodes.length-1])}),r.classList.add("newReview");const a=document.createElement("textarea");a.setAttribute("placeholder","Your review goes here..."),a.setAttribute("name","comments");const i=document.createElement("input");i.setAttribute("name","restaurant_id"),i.setAttribute("value",self.restaurant.id),i.style.display="none";const s=document.createElement("input");s.setAttribute("name","name"),s.setAttribute("type","text"),s.setAttribute("placeholder","Your Name");const o=document.createElement("button");o.innerHTML="Create review",o.setAttribute("type","submit");const l=document.createElement("select");l.setAttribute("name","rating");let d="";for(let e=1;e<6;e++)d+=`${String.fromCodePoint(11088)}`,this[`option${e}`]=document.createElement("option"),this[`option${e}`].setAttribute("value",e),this[`option${e}`].innerHTML=`${d} ${e} Stars`,l.appendChild(this[`option${e}`]);o.innerHTML="Create review",o.setAttribute("type","submit"),r.appendChild(i),r.appendChild(s),r.appendChild(a),r.appendChild(l),r.appendChild(o),n.appendChild(r),t.appendChild(n)},createReviewHTML=e=>{const t=document.createElement("li"),n=document.createElement("p");n.innerHTML=e.name,n.classList.add("review-author");const r=document.createElement("span"),a=new Date(e.createdAt||Date.now()),i=a.getUTCMonth()+1,s=a.getUTCDate(),o=a.getUTCFullYear();r.innerHTML=o+"/"+i+"/"+s,r.classList.add("review-date"),n.appendChild(r),t.appendChild(n);const l=document.createElement("p");l.innerHTML=`Rating: ${e.rating}`,l.classList.add("review-rating"),t.appendChild(l);const d=document.createElement("p");return d.innerHTML=e.comments,d.classList.add("review-comments"),t.appendChild(d),t},fillBreadcrumb=(e=self.restaurant)=>{const t=document.getElementById("breadcrumb");if(t.childNodes.length<4){const n=document.createElement("li");n.innerHTML=e.name,t.appendChild(n)}},getParameterByName=(e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null};
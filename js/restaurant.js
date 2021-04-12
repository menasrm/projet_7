import { deleteChild } from './utils.js';

export class Restaurant {
  constructor(restaurantName, address, lat, long, ratings, averageRating, id) {
    this.restaurantName = restaurantName;
    this.address = address;
    this.lat = lat;
    this.long = long;
    this.ratings = ratings;
    this.averageRating = averageRating;
    this.id = id;
    this.addedRatings = [];
  }
}


/* CONSTRUIT LE RESTAURANT SELECTIONNE */

export function formatingClickedRestaurant(element, restaurantId) {
  const mainDiv = document.createElement('DIV');
  const reviewButton = document.createElement('button');
  deleteChild(restaurantId);
  // Ajouter un bouton de révision //
  reviewButton.innerHTML = 'Ajouter un avis';
  reviewButton.className += 'clickedRestaurantaddReview';
  reviewButton.id += element.address;
  // Obtenez des notes de restaurant et commentez //
  let restaurantRatings = '';
  for (const rating of element.ratings) {
    restaurantRatings += `<p id="clickedRestaurantStar">${rating.stars} : ${rating.comment}</p><div id="line"><hr></div></div>`;
  }
  // Ajouter des infos sur les restaurants //
  mainDiv.className += 'clickedRestaurant';
  mainDiv.innerHTML = `<h3 class="restaurantName" id="clickedRestaurantNameAndAverage"> Restaurant: ${element.restaurantName}</br>
  ${element.averageRating}</h3>
  <img id="clickedRestaurantImg" src="https://maps.googleapis.com/maps/api/streetview?size=200x200&location=${element.lat},${element.long}&heading=151.78&pitch=-0.76&key=AIzaSyCCE5f7uZZIOugk3bPODVSZW2pEL1z05A4"/>
  <div id="clickedRestaurantStarAndComment">${restaurantRatings}`;
  return { reviewButton, mainDiv };
}


/* CONSTRUIT ET AFFICHAGE LE RESTAURANT SUR LA LISTE DE GAUCHE */

export function createRestaurantOnList(element) {
  const child = document.createElement('DIV');
  // Ajoutez les infos sur les restaurants //
  child.className += 'restaurant';
  child.innerHTML = `
    <h4>Restaurant: ${element.restaurantName}</h4></br> 
    <h4>${element.address}</h4></br>
    <h4 style='font-size:14px'>Moyenne: ${element.averageRating}</h4></br>
    <div id="line"><hr></div>`;
  const restaurantList = document.getElementById('restaurantList');
  restaurantList.appendChild(child);
}

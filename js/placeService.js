/* DEMANDE DE RECHERCHE À PROXIMITÉ */

export function requestNearbySearch(service, google, position) {
  const request = {
    location: position,
    radius: '600',
    type: ['restaurant'],
  };
  return new Promise((resolve, reject) => {
    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK || google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve(results);
      } else {
        reject(new Error(`problem with nearbySearch: ${status}`));
      }
    });
  });
}

/* OBTENIR UNE DEMANDE DE DÉTAILS */

export function requestGetDetails(google, service, element) {
  const request = {
    placeId: element.id,
    fields: ['review', 'place_id'],
  };
  return new Promise((resolve, reject) => {
    service.getDetails(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK || google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve(results);
      } else {
        reject(new Error(`problem with getDetails: ${status}`));
      }
    });
  });
}

/* CONSTRUIT ET RETOURNE LES RESTAURANTS DEMANDÉS À PROXIMITÉ */

export function getPlaceRestaurantsObjects(requestedRestaurantsNearby) {
  const restaurants = requestedRestaurantsNearby.map((element) => ({
    id: element.place_id, restaurantName: element.name, address: element.vicinity, ratings: [], lat: element.geometry.location.lat(), long: element.geometry.location.lng(), averageRating: element.rating,
  }));
  return restaurants;
}


/* CONSTRUIT ET RETOURNE LES AVIS AVEC LES ETOILES ET LES COMMENTAIRES */

export function addReviewsToPlaceRestaurants(ratingsArray) {
  const restaurantReview = ratingsArray.reviews.map((review) => ({ stars: review.rating, comment: review.text }));
  return restaurantReview;
}


/* AJOUTER DES AVIS AU RESTAURANT */

export async function getReviews(google, service, element) {
  // Demande d'avis et d'identifiant de restaurant //
  const placeReviews = await requestGetDetails(google, service, element);
  // Obtient des étoiles et des commentaires //
  const restaurantReviews = addReviewsToPlaceRestaurants(placeReviews);
  // Ajouter les avis demandés aux restaurants et les avis précédemment ajoutés //
  element.ratings = [...element.addedRatings, ...restaurantReviews];
}

import { fetchJsonData } from './utils.js';
import RestaurantManager from './restaurantManager.js';

/* APP MANAGER */

export default async function appManager(google) {
  // Obtenir les données de fichier JSON et la position de l'utilisateur //
  const jsonDatas = await fetchJsonData();

  // Position affiché //
  navigator.geolocation.watchPosition(function(position) {
      // Position de l'utilisateur //
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      // Centre de la carte sur l'emplacement de l'utilisateur //
      const map = new google.maps.Map(document.getElementById('mapContainer'), {
        center: pos,
        zoom: 15,
      });
      // Run Application //
      const restaurantManager = new RestaurantManager(map, google, pos);
      restaurantManager.runApp(jsonDatas);
  },
  function(error) {
    if (error.code == error.PERMISSION_DENIED)
    // Information pour l'utilisateur //
    alert('Vous n\'avez pas autorisé la géolocalisation, la carte sera centrée sur la ville de Toulon');
    // Run Application avec paramètre par défaut//
    const restaurantManager = new RestaurantManager(
      new google.maps.Map(document.getElementById('mapContainer'), { center: { lat: 43.1167, lng: 5.9333 }, zoom: 16 }),
      google,
      { lat: 43.1167, lng: 5.9333 },
    );
    restaurantManager.runApp(jsonDatas);
  });
}
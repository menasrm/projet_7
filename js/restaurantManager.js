import { Restaurant, createRestaurantOnList, formatingClickedRestaurant } from './restaurant.js';
import {
  requestNearbySearch, getPlaceRestaurantsObjects, getReviews,
} from './placeService.js';
import {
  maxFilter, minFilter, addFilterOptions, removeFilterOptions,
} from './filters.js';
import {
  addReviewsFormManagement, newFormManagement, addReviewToRestaurant, getNewFormData, checkNewForm, checkViewForm, getSelectedNote,
} from './forms.js';
import {
  calculateAverage, deleteChild, removeElement, removeMarkers,
} from './utils.js';

/* RESTAURANT MANAGER */

export default class RestaurantManager {
  constructor(map, google, position) {
    this.google = google;
    this.map = map;
    this.position = position;
    this.service = new google.maps.places.PlacesService(this.map);
    this.restaurants = [];
    this.storedRestaurants = [];
    this.markersToRemoveOnChange = [];
    this.restaurantListId = document.getElementById('restaurantList');
    this.restaurantClickedId = document.getElementById('restaurantClickedContainer');
  }

  /* CRÉER UN MARQUEUR */

  createMarker(position, markerImg) {
    const marker = new this.google.maps.Marker({
      map: this.map,
      position,
      icon: markerImg,
    });
    return marker;
  }


  /* AJOUTER UNE INFOWINDOW SUR UN MARQUEUR */

  addInfoWindowOnMarker(marker, customContent) {
    const infowindow = new this.google.maps.InfoWindow({
      content: customContent,
    });
    marker.addListener('click', () => {
      infowindow.open(this.map, marker);
    });
  }


  /* CRÉER DE NOUVELLES INSTANCES DE RESTAURANTS */

  createNewRestaurantsInstances(objectsArray) {
    objectsArray.forEach((element) => {
      const newRestaurant = new Restaurant(
        element.restaurantName,
        element.address,
        element.lat,
        element.long,
        element.ratings,
        element.averageRating,
        element.id,
      );
      // Ajouter des instances dans le tableau des restaurants et le tableau des restaurants sotred //
      this.restaurants.push(newRestaurant);
      this.storedRestaurants.push(newRestaurant);
    });
  }


  /* OBTENIR DES RESTAURANTS ET CRÉER DES INSTANCES DE RESTAURANT */

  async placeRestaurantsManager() {
    // Demande de recherche à proximité //
    const requestRestoNearby = await requestNearbySearch(this.service, this.google, this.position);
    // Créer des instances de restaurants demandés //
    const getPlaceRestaurants = getPlaceRestaurantsObjects(requestRestoNearby);
    return this.createNewRestaurantsInstances(getPlaceRestaurants);
  }


  /* RESTAURANT LOCAL SUR INIT */

  localRestaurantsManager(localRestaurants) {
    const modifiedRestaurants = localRestaurants.map((element) => {
      // Calculer la note moyenne des restaurants locaux //
      const averageNote = calculateAverage(element.ratings);
      return {
        ...element,
        averageRating: averageNote,
      };
    });
    // Créer des instances //
    this.createNewRestaurantsInstances(modifiedRestaurants);
    // Vérifiez quels restaurants locaux sont sur la carte et ajoutez UNIQUEMENT ces restaurants sur le tableau //
    this.google.maps.event.addListenerOnce(this.map, 'idle', () => {
      const filteredLocalRestaurants = this.restaurants.filter((element) => this.map.getBounds().contains({ lat: element.lat, lng: element.long }));
      this.restaurants = filteredLocalRestaurants;
    });
  }


  /* FONCTION POUR GÉRER LE RESTAURANT CLIQUÉ */

  displayClickedRestaurant(element, restaurantId) {
    // Pour chaque restaurant à afficher: obtenez les div de mise en forme et leurs boutons d'avis //
    const { reviewButton, mainDiv } = formatingClickedRestaurant(element, restaurantId);
    // Ajouter un événement cliquez sur le bouton de révision //
    reviewButton.addEventListener('click', () => {
      addReviewsFormManagement();
      // Ajouter un événement cliquez sur le bouton Soumettre //
      document.getElementById('reviewFormSubmit').addEventListener('click', () => {
        // Vérifiez si les entrées ne sont pas vides //
        checkViewForm();
        // Vérifier si une note est sélectionnée
        const { note } = document.forms.reviewForm.elements;
        const selectedNoteArray = getSelectedNote(note);
        // Si non est sélectionné et entrée non vide //
        if (selectedNoteArray.length > 0) {
          // Ajouter un commentaire //
          addReviewToRestaurant(this.restaurants, reviewButton.id);
          deleteChild(restaurantId);
          this.displayClickedRestaurant(element, restaurantId);
          removeElement('reviewForm-container');
        }
      });
    });
    restaurantId.appendChild(reviewButton);
    restaurantId.appendChild(mainDiv);
  }


  /* FONCTION PRINCIPALE POUR GÉRER LES LISTES DES RESTAURANTS SUR LA CARTE */

  manageAndDisplayRestaurants() {
    removeMarkers(this.markersToRemoveOnChange);
    deleteChild(this.restaurantListId);
    // Parcourez les restaurants pour les afficher //
    this.restaurants.forEach((element) => {
      // Vérifier si le restaurant est dans le filtre //
      if (element.averageRating >= parseInt(minFilter.value, 10) && element.averageRating <= parseInt(maxFilter.value, 10)) {
        // Ajouter un marqueur et ajouter un événement cliquez sur //
        const marker = this.createMarker({ lat: element.lat, lng: element.long }, 'https://img.icons8.com/ultraviolet/30/000000/marker.png');
        marker.addListener('click', async () => {
          this.markersToRemoveOnChange.forEach((el) => {
            el.setIcon('https://img.icons8.com/ultraviolet/30/000000/marker.png');
          });
          marker.setIcon('https://img.icons8.com/ultraviolet/40/000000/marker.png');
          // Vérifier si le restaurant est un restaurant demandé et non local //
          if (element.id !== null) {
            // Demander des avis sur ce restaurant //
            await getReviews(this.google, this.service, element);
          }
          // Formater et afficher les informations du restaurant sur une zone cliquée spécifique //
          this.displayClickedRestaurant(element, this.restaurantClickedId);
        });
        // Ajouter un marqueur pour supprimer la liste //
        this.markersToRemoveOnChange.push(marker);
        // Formater et afficher les informations du restaurant sur la liste de gauche //
        createRestaurantOnList(element);
      }
    });
  }


  /* NOUVEAU GESTIONNAIRE DE FORMULAIRE DE RESTAURANT */

  addRestaurantFormOperation() {
    // Ajouter un event click sur la carte //
    this.google.maps.event.addListener(this.map, 'click', (event) => {
      newFormManagement(event);
      const newElemForm = document.getElementById('newElementFormSubmit');
      // Ajouter un événement cliquez sur le nouveau formulaire d'élément //
      newElemForm.addEventListener('click', () => {
        // Vérifiez si les entrées ne sont pas vides //
        checkNewForm();
        // Vérifier si une note est sélectionnée
        const { note } = document.forms.newElementForm.elements;
        const selectedNoteArray = getSelectedNote(note);
        if (selectedNoteArray.length > 0) {
          // Ajouter un nouveau restaurant //
          const formData = [getNewFormData()];
          this.createNewRestaurantsInstances(formData);
          this.manageAndDisplayRestaurants();
          removeElement('newElementForm-container');
        }
      });
    });
  }


  /* FILTRE LORS D'UN CHANGEMENT */

  filterOnChange(filter) {
    // Ajouter un event change sur le filtre //
    filter.addEventListener('change', () => {
      this.manageAndDisplayRestaurants();
      removeFilterOptions();
      addFilterOptions();
    });
  }


  /* GESTION DE LA CARTE DES ÉVÉNEMENTS */

  async eventManagement() {
    // Sur événement de mouvement ou de zoom: Demande de restaurants à proximité du centre de la carte //
    const requestedRestaurantsNearby = await requestNearbySearch(this.service, this.google, this.map.getCenter());
    // Transformez les restaurants demandés en objets //
    const getPlaceRestaurants = getPlaceRestaurantsObjects(requestedRestaurantsNearby);
    // Obtenez tous les restaurants demandés stockés dans un tableau stocké //
    const storedRestaurantsIds = this.storedRestaurants.map((element) => element.id);
    // Filtrer les restaurants demandés qui sont nouveaux, pas déjà stockés dans un tableau stocké //
    const newRestausNotStored = getPlaceRestaurants.filter((element) => !storedRestaurantsIds.includes(element.id));
    // Tableau de restaurants vides //
    this.restaurants = [];
    this.createNewRestaurantsInstances(newRestausNotStored);
    // Afficher tous les restaurants stockés (demandés ou locaux) s'ils sont sur la carte //
    this.storedRestaurants.forEach((element) => {
      if (this.map.getBounds().contains({ lat: element.lat, lng: element.long })) {
        if (!this.restaurants.includes(element)) {
          this.restaurants.push(element);
        }
      }
    });
    this.manageAndDisplayRestaurants();
  }


  /* GESTION DES ÉVÉNEMENTS DE LA CARTE APPLIQUÉS POUR UN MOUVEMENT ET ZOOM CHANGÉ */

  dragendZoomEventsManager() {
    this.google.maps.event.addListener(this.map, 'dragend', async () => {
      this.eventManagement();
    });
    this.google.maps.event.addListener(this.map, 'zoom_changed', async () => {
      this.eventManagement();
    });
  }


  /* EXÉCUTION DE L'APPLICATION */

  async runApp(jsonDatas) {
    // Définir le marqueur utilisateur //
    this.userPositionMarker = this.createMarker(this.position, 'https://img.icons8.com/nolan/50/marker.png');
    this.addInfoWindowOnMarker(this.userPositionMarker, 'Vous êtes ici');
    // Gérer les restaurants locaux (créer des instances, stocker) //
    this.localRestaurantsManager(jsonDatas);
    // Demander un restaurant à proximité //
    await this.placeRestaurantsManager();
    // Gérer et afficher les restaurants //
    this.manageAndDisplayRestaurants();
    // Filtres d'initialisation //
    this.filterOnChange(minFilter);
    this.filterOnChange(maxFilter);
    // Initier un nouveau formulaire de restaurant //
    this.addRestaurantFormOperation();
    // Carte des événements d'initiation //
    this.dragendZoomEventsManager();
  }
}

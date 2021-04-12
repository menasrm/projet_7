// Filtres //
export const maxFilter = document.getElementById('maxFilter');
export const minFilter = document.getElementById('minFilter');

// Filtres options du tableau //
const maxOptionsArray = [...document.getElementsByClassName('maxFilterOption')];
const minOptionsArray = [...document.getElementsByClassName('minFilterOption')];

// Filtres valeurs du tableau //
let valuesToAddToFilter = [];
let valuesToRemoveToFilter = [];


/* Ajouter des options aux filtres */

export function addFilterOptions() {
  minOptionsArray.forEach((element) => {
    if (element.value > minOptionsArray[0].value && element.value <= maxFilter.value) {
      valuesToAddToFilter.push(element);
    }
    valuesToAddToFilter.forEach(() => {
      minFilter.appendChild(element);
    });
    valuesToAddToFilter = [];
  });

  maxOptionsArray.forEach((element) => {
    if (element.value >= minFilter.value && element.value <= maxOptionsArray[maxOptionsArray.length - 1].value) {
      valuesToAddToFilter.push(element);
    }
    valuesToAddToFilter.forEach(() => {
      maxFilter.appendChild(element);
    });
    valuesToAddToFilter = [];
  });
}


/* Effacer les options des filtres */

export function removeFilterOptions() {
  minOptionsArray.forEach((element) => {
    if (element.value > maxFilter.value) {
      valuesToRemoveToFilter.push(element);
    }
  });
  valuesToRemoveToFilter.forEach((element) => {
    element.remove();
  });
  valuesToRemoveToFilter = [];

  maxOptionsArray.forEach((element) => {
    if (element.value < minFilter.value) {
      valuesToRemoveToFilter.push(element);
    }
  });
  valuesToRemoveToFilter.forEach((element) => {
    element.remove();
  });
  valuesToRemoveToFilter = [];
}

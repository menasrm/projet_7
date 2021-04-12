/* FETCH JSON : RESTAURANTS LOCAUX */

export async function fetchJsonData() {
  try {
    const response = await fetch('data.json');
    if (response.ok) {
      return await response.json();
    }
    console.error('Retour du serveur : ', response.status);
  } catch (e) {
    console.error(e);
  }
}


/* CALCULER LA NOTE MOYENNE DES RESTAURANTS LOCAUX */

export function calculateAverage(notes) {
  let notesSum = 0;
  // Somme de toutes les notes //
  for (let i = 0; i < notes.length; i++) {
    notesSum += notes[i].stars;
  }
  // Divisé par le nombre de notes //
  const finalSum = notesSum / notes.length;
  return (finalSum.toFixed(1));
}


/* SUPPRIMER L'ÉLÉMENT ENFANT DE LA LISTE */

export function deleteChild(containerId) {
  let child = containerId.lastElementChild;
  while (child) {
    containerId.removeChild(child);
    child = containerId.lastElementChild;
  }
}


/* SUPPRIMER L'ÉLÉMENT DE LA LISTE */

export function removeElement(element) {
  document.getElementById(element).remove();
}


/* SUPPRIMER LES MARQUEURS SUR LA CARTE */

export function removeMarkers(markers) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

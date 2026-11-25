const layouts = {
  dry: {
    title: "Dry Prep Station",
    description: "An uninterrupted worktop for dry prep, with two shelves above and storage below.",
    features: ["Flat stainless steel worktop", "Two upper shelves", "Open lower shelf"],
    alt: "Dry prep station with a flat worktop, two upper shelves and a lower shelf.",
    width: 1086, height: 1448
  },
  contour: {
    title: "Contoured Pan Station",
    description: "Four inset pans sit behind a work surface that extends to the left for additional prep space.",
    features: ["Angled transition in the worktop", "Four inset pans", "Contoured lower shelf"],
    alt: "Four-pan station with an extended left worktop, angled transition and matching open lower shelf.",
    width: 1440, height: 960
  },
  storage: {
    title: "Pan Station with Storage",
    description: "A four-pan worktop pairs with central cabinets and open shelves on both sides.",
    features: ["Four inset pans", "Two center cabinet doors", "Open storage on both sides"],
    alt: "Four-pan station with two central cabinet doors and open shelving to either side.",
    width: 1440, height: 960
  },
  sink: {
    title: "Prep Station with Sinks",
    description: "A stainless steel divider separates the sink area from the adjacent prep surface.",
    features: ["Sinks grouped on the right", "Divider between prep and sink areas", "Two upper shelves"],
    alt: "Stainless steel prep station with two sinks on the right of a vertical divider.",
    width: 1086, height: 1448
  }
};

const layoutSection = document.querySelector("#layouts");
const stationButtons = document.querySelectorAll("[data-station]");
const stationImage = document.querySelector("#station-image");
const stationTitle = document.querySelector("#station-title");
const stationDescription = document.querySelector("#station-description");
const stationFeatures = document.querySelector("#station-features");
const quoteLayout = document.querySelector("#quote-layout");
const dialog = document.querySelector("#image-dialog");
let activeLayout = "dry";

for (const layout of Object.values(layouts)) {
  quoteLayout.add(new Option(layout.title, layout.title));
}

for (const button of stationButtons) {
  button.addEventListener("click", () => {
    activeLayout = button.dataset.station;
    const layout = layouts[activeLayout];
    stationImage.src = "images/custom-made/station-" + activeLayout + ".webp";
    stationImage.alt = layout.alt;
    stationImage.width = layout.width;
    stationImage.height = layout.height;
    stationTitle.textContent = layout.title;
    stationDescription.textContent = layout.description;
    stationFeatures.replaceChildren(...layout.features.map((feature) => {
      const item = document.createElement("li");
      item.textContent = feature;
      return item;
    }));

    for (const candidate of stationButtons) {
      candidate.setAttribute("aria-pressed", String(candidate.dataset.station === activeLayout));
    }

    if (button.closest(".hotspots")) {
      document.querySelector('.stations [data-station="' + activeLayout + '"]').focus({preventScroll: true});
      layoutSection.scrollIntoView();
    }
  });
}

document.querySelector("#quote-selection").addEventListener("click", () => {
  quoteLayout.value = layouts[activeLayout].title;
});

document.querySelector("#expand").addEventListener("click", () => dialog.showModal());

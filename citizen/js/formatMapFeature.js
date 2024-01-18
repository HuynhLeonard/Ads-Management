export const formatMapFeature = (feature) => {

  const { properties, text } = feature;
  let address = properties.address ? properties.address.split(",")[0] : feature.place_name.split(",")[0];
  const coordinates = feature.geometry.coordinates.slice();

  address = address.replace(/"/g, "");
  address += `, ${feature.context[0].text || ""}, ${feature.context[2].text || ""}, ${feature.context[3].text || ""}`
  if (address.includes(text)) {
    address = address.replace(`${text}, `, '');
  }

  return {
    text,
    address,
    coordinates,
  };
};

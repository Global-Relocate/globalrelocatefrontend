const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";

const QUERY = (countryQid, language) => `
SELECT DISTINCT ?mission ?missionLabel ?hostCountry ?hostCountryLabel ?city ?cityLabel 
  (COALESCE(
    SAMPLE(?streetAddress),
    SAMPLE(?fullAddress),
    SAMPLE(?postalCode),
    "—"
  ) AS ?address)
  (SAMPLE(?website) AS ?website) 
WHERE {
  VALUES ?missionType { wd:Q3917681 wd:Q12143816 }
  ?mission wdt:P31/wdt:P279* ?missionType .
  ?mission wdt:P137 wd:${countryQid} .
  ?mission wdt:P17 ?hostCountry .
  OPTIONAL { ?mission wdt:P131 ?city }
  OPTIONAL { ?mission wdt:P969 ?streetAddress }
  OPTIONAL { ?mission wdt:P6375 ?fullAddress }
  OPTIONAL { ?mission wdt:P281 ?postalCode }
  OPTIONAL { ?mission wdt:P856 ?website }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "${language}". }
}
GROUP BY ?mission ?missionLabel ?hostCountry ?hostCountryLabel ?city ?cityLabel ?address ?website
`;

export const getEmbassies = async (countryQid, language = "en") => {
  const response = await fetch(SPARQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/sparql-query",
      Accept: "application/sparql-results+json",
      "User-Agent": "GlobalRelocate-App/1.0",
    },
    body: QUERY(countryQid, language),
  });

  if (!response.ok) {
    throw new Error(`SPARQL error: ${response.status}`);
  }

  const data = await response.json();

  const result = data.results.bindings.map((b) => ({
    embassy: b.mission?.value,
    embassyLabel: b.missionLabel?.value,
    owner: b.hostCountry?.value ?? "",
    owner: b.hostCountryLabel?.value ?? "Unknown",
    location: b.city?.value,
    locationLabel: b.cityLabel?.value,
    address: b.address?.value,
    website: b.website?.value,
  }));

  return result;
};

import en from "./en.json";
import ar from "./ar.json";

// UI strings only — static labels, buttons, headings.
// One JSON file per language keeps this readable and diffable,
// instead of one giant object with every language mixed together.
const translations = { en, ar };

export default translations;

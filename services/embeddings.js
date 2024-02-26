const tf = require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");

async function getWordEmbedding(text) {
  try {
    const model = await use.load();

    const sentences = text
      .split(/[.!?]/)
      .filter((sentence) => sentence.trim() !== "");

    const promises = sentences.map(async (sentence, index) => {
      try {
        const embedding = await model.embed([sentence]);
        return {
          id: sentence,
          values: embedding.arraySync()[0],
        };
      } catch (error) {
        console.error(`Error embedding sentence "${sentence}":`, error.message);
        return {
          id: String.fromCharCode(65 + index),
          values: null,
          error: error.message,
        };
      }
    });

    const results = await Promise.allSettled(promises);

    const embeddings = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    return embeddings;
  } catch (error) {
    console.error(
      "Error loading Universal Sentence Encoder model:",
      error.message
    );
    return [];
  }
}

module.exports = {
  getWordEmbedding,
};

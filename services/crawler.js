const { getWordEmbedding } = require("./embeddings");
const { storeInPinecone } = require("./vectorDB");
const axios = require('axios');
const cheerio = require('cheerio');


async function crawlAndClean(url) {
  try {
    // Fetch the HTML content of the website
    const response = await axios.get(url);
    const htmlContent = response.data;

    // Load the HTML content into Cheerio
    const $ = cheerio.load(htmlContent);

    // Remove JavaScript
    $('script').remove();

    // Remove CSS
    $('style').remove();

    // Get the cleaned text content
    const cleanedText = $('body').text();

    return cleanedText;
  } catch (error) {
    console.error("Error during crawling and cleaning:", error.message);
    throw new Error("Error during crawling and cleaning");
  }
}

async function crawlAndVectorize(url) {
  try {
    const crawledData = await crawlAndClean(url);

    // Step 2: Convert crawled textual data into vectorized representations
    const textEmbedding = await getWordEmbedding(crawledData);
    console.log(textEmbedding)
    // Step 3: Store the vectorized data in Pinecone
    await storeInPinecone(textEmbedding);

    console.log("Crawling and vectorization successful");
    return { success: true, message: "Crawling and vectorization successful" };
  } catch (error) {
    console.error("Error during crawling and vectorization:", error);
    throw new Error("Error during crawling and vectorization");
  }
}

module.exports = { crawlAndVectorize };

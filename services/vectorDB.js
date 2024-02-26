const { Pinecone } = require("@pinecone-database/pinecone");
const { getWordEmbedding } = require("./embeddings");
const config = require("../config");

// Initialize Pinecone client with your Pinecone API key and index name
const pineconeClient = new Pinecone({ apiKey: config.PINECONE_API_KEY });
const pineconeIndex = pineconeClient.index(config.PINECONE_INDEX_NAME);

/**
 * Get top results from Pinecone index based on the query.
 * @param {string} query - The query for retrieving top results.
 * @param {number} topK - The number of top results to retrieve.
 * @returns {Array} - An array of objects containing 'id' and 'score'.
 */
async function getTopResults(query, topK = 3) {
  try {
    const queryEmbedding = await getWordEmbedding(query);

    if (!queryEmbedding || !queryEmbedding[0] || !queryEmbedding[0].values) {
      console.error("Error: Query embedding not available.", queryEmbedding);
      throw new Error("Query embedding not available");
    }

    console.log("Query Embedding:", queryEmbedding[0].values);

    const queryResponse = await pineconeIndex.query({
      vector: queryEmbedding[0].values,
      topK,
      includeMetadata: true,
    });

    // Extracting only 'id' and 'score' from the response
    const extractedResults = queryResponse.matches.map((result) => ({
      id: result.id,
      score: result.score,
      text: result?.metadata?.txt,
    }));

    console.log("Top Results:", extractedResults);
    return extractedResults;
  } catch (error) {
    console.error("Error in getTopResults:", error.message);
    throw new Error("Internal Server Error");
  }
}

async function storeInPinecone(vectorizedData) {
  try {
    const batchSize = 50;
    const promises = [];
    let idCounter = 1; // Initialize the counter

    for (let i = 0; i < vectorizedData.length; i += batchSize) {
      const batch = vectorizedData.slice(i, i + batchSize);

      // Sanitize vector IDs to remove non-ASCII characters
      batch.forEach((vector) => {
        
        // Add metadata with txt property
        vector.metadata = { txt: vector.id }; 

        // Assign incremental integer value to vector.id
        vector.id = idCounter.toString();
        idCounter++;
        
      });

      const promise = pineconeIndex.upsert(batch);
      promises.push(promise);
    }

    // Wait for all promises to resolve
    const results = await Promise.allSettled(promises);

    // Handle any errors that occurred during upsert
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`Error in batch ${index}:`, result.reason.message);
      }
    });

    console.log("Vectorized data stored in Pinecone successfully");
  } catch (error) {
    console.error("Error storing data in Pinecone:", error.message);
    throw new Error("Failed to upsert vectorized data in Pinecone");
  }
}

module.exports = {
  storeInPinecone,
  getTopResults,
};

# highlevel_assignment

This project uses Web Crawling and Vectorization to create a conversational platform whose key features are

  - Crawling text data from a URL and storing its vectorized version to Pinecone DB (Vector Database)
  - User can query on this dataset using below APIs

     Example -
     In the below POST Api it fetches data from Wikipedia about India
     And In the GET Api we can ask questions related to this data like ( when India got independence, what languages are spoken in India, what all states are present in India)

# Use Node Version >=18

   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
   nvm install 18 
   nvm use 18

# Install all the dependencies

  npm i

# Run the server

  node app.js

(server will start on port 3000)

# CURL to crawl a URL and store the data in Pinecone DB  ( Generating embeddings is a compute-heavy task so that this API might take 20 - 30 sec depending upon the content of your URL)

curl --location 'http://localhost:3000/crawl' \
--header 'Content-Type: application/json' \
--data '{
    "url": "https://en.wikipedia.org/wiki/India"
}'

# CURL to submit any user query ( Again, cosine similarity matrix comparison is a compute-heavy task, So this API might take 5-7 secs depending upon the dataset)

curl --location 'http://localhost:3000/query?question=which%20is%20the%20most%20populus%20country%20in%202023'



   

const redis = require('redis');
const dotenv = require('dotenv')
dotenv.config();


// byDefault it run on the localhost port 6379
const redisClient = () =>{
      return redis.createClient({
             url : process.env.redis_url
      })
} 

const client = redisClient();
// these are listeners
client.on("error", (err) => {
    console.log(err);
})

client.on("connect" , () => {
    console.log("connected to redis");
})

client.on("end" , () => {
    console.log("redis connection ended");
})

client.on("SIGIQUIT" , () => {
  client.quit()
})

module.exports = {client};

// Script to setup auto increment in primary key for user
//http://docs.mongodb.org/manual/tutorial/create-an-auto-incrementing-field/

db.counters.insert(
   {
      _id: "userid",
      seq: 0
   }
)
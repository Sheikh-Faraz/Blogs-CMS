<!-- Mongoose POPULATE Function -->
The populate() method in Mongoose automatically replaces a reference field (an ObjectId pointing to another document) with the actual document content from that referenced collection. It acts like an SQL join, allowing you to fetch related data without running separate manual queries

<!-- How It Works -->
Define a Reference: 
Set a field type to mongoose.Schema.Types.ObjectId and provide a ref property pointing to your target model name.

Call .populate(): 
Chain the method onto your query (like .find() or .findOne()) to pull in the matching record.


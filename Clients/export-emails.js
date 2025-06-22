const { MongoClient } = require('mongodb');
const fs = require('fs');

const uri = "mongodb+srv://heavenonearthconnections:0bvGsLsxJ67R3GdH@hoecweb.4fkvm.mongodb.net/hoecweb?retryWrites=true&w=majority&appName=hoecweb";

async function exportEmails() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        
        const db = client.db("hoecweb");
        const collection = db.collection("users");
        
        // Get all unique emails
        const emails = await collection.distinct("email");
        
        // Write emails to file, one per line
        const emailText = emails.join('\n');
        fs.writeFileSync('emails.txt', emailText);
        
        console.log(`Exported ${emails.length} emails to emails.txt`);
        
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
    }
}

exportEmails();
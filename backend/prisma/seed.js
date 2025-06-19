const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const stopwords = new Set([
  "the", "is", "and", "a", "an", "to", "for", "with", "on", "in", "of", "at",
  "this", "that", "where", "whom", "who", "it", "was", "are", "i", "my", "very", "so",
  "but", "is", "am", "if", "he", "she", "they", "them", "we", "us", "you", "your",
  "his", "her", "its", "their", "there", "here", "what", "which", "when", "why", "how",
  "all", "some", "any", "no", "not", "just", "like", "more", "than", "out", "up", "down",
  "over", "under", "into", "about", "as", "by", "from", "be", "been", "being", "will",
  "would", "should", "could", "can", "may", "might", "must", "shall", "do", "does",
  "did", "doing", "has", "have", "had", "having", "therefore", "thus", "hence", "also",
  "such", "these", "those", "each", "every", "few", "many", "much"
]);

async function main() {
  const feedbacks = await prisma.feedback.findMany({
    select: {
      review: true,
    },
  });

  for (const i of feedbacks) {
    if (!i.review) continue;
    const words = i.review.split(/\s+/);
    for (const it of words) {
      const word = it.toLowerCase().replace(/[^\w]/g, ""); 
      if (!word || stopwords.has(word)) continue;

      const existing = await prisma.mostfreq.findUnique({
        where: { word },
      });

      if (existing) {
        await prisma.mostfreq.update({
          where: { word },
          data: { count: existing.count + 1 },
        });
      } else {
        await prisma.mostfreq.create({
          data: { word, count: 1 },
        });
      }
    }
  }

  console.log("Word frequencies updated in 'mostfreq.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error("Error in word frequency script:", err);
    prisma.$disconnect();
    process.exit(1);
  });

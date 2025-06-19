const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.post("/api", async (req, res) => {
  const { productId, rating, review, email, image } = req.body;
  console.log(req.body);
  if (!email || !productId || (rating == null && !review)) {
    return res.status(400).json({ error: "Required field is missing" });
  }

  try {
    const existingUser = await prisma.feedback.findUnique({
      where: {
        email_productId: {
          email,
          productId,
        },
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "You have already submitted feedback." });
    }

    const feedback = await prisma.feedback.create({
      data: {
        rating,
        review,
        email,
        image,
        product: { connect: { id: productId } },
      },
    });
    if (review) {
      const words = review.split(/\s+/);
      for (const it of words) {
        const word = it.toLowerCase();
        if (stopwords.has(word)) continue;
        else {
          const x = 0;
          const exit = await prisma.mostfreq.findUnique({
            where: {
              word,
            },
          });
          if (exit) {
            x = exit.count;
          }
          await prisma.mostfreq.create({
            data: {
              count: x + 1,
              word,
            },
          });
        }
      }
    }

    res
      .status(201)
      .json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/check-feedback", async (req, res) => {
  const { email, productId } = req.query;

  if (!email || !productId) {
    return res.status(400).json({ error: "Email and productId are required" });
  }

  try {
    const existing = await prisma.feedback.findUnique({
      where: {
        email_productId: {
          email,
          productId: parseInt(productId),
        },
      },
    });

    if (existing) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

app.get("/feed", async (req, res) => {
  const { productId } = req.query;

  try {
    const feedback = await prisma.feedback.findMany({
      where: {
        productId: parseInt(productId),
      },
    });

    res.json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/products", async (req, res) => {
  const f = await prisma.product.findMany({
    include: {
      feedbacks: true,
    },
  });
  res.json(f);
});
const stopwords = new Set([
  "the",
  "is",
  "and",
  "a",
  "an",
  "to",
  "for",
  "with",
  "on",
  "in",
  "of",
  "at",
  "this",
  "that",
  "where",
  "whom",
  "who",
  "it",
  "was",
  "are",
  "i",
  "my",
  "very",
  "so",
  "but",
  "is",
  "am",
  "if",
  "he",
  "she",
  "they",
  "them",
  "we",
  "us",
  "you",
  "your",
  "his",
  "her",
  "its",
  "their",
  "there",
  "here",
  "what",
  "which",
  "when",
  "why",
  "how",
  "all",
  "some",
  "any",
  "no",
  "not",
  "just",
  "like",
  "more",
  "than",
  "out",
  "up",
  "down",
  "over",
  "under",
  "into",
  "about",
  "as",
  "by",
  "from",
  "at",
  "be",
  "been",
  "being",
  "will",
  "would",
  "should",
  "could",
  "can",
  "may",
  "might",
  "must",
  "shall",
  "do",
  "does",
  "did",
  "doing",
  "has",
  "have",
  "had",
  "having",
  "therefore",
  "thus",
  "hence",
  "also",
  "such",
  "these",
  "those",
  "each",
  "every",
  "few",
  "many",
  "much",
  "more",
]);


app.get("/", (req, res) => {
  res.send("hii there");
});
app.get("/mfreq", async (req, res) => {
  const most_freq = await prisma.mostfreq.findMany({
    where: {
      count: {
        gt: 1,
      },
    },
    orderBy: {
      count: "desc",
    },
  });
  res.json(most_freq);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

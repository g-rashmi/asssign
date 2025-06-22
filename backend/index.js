const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const englishwords = new Set(require("word-list-json"));

const app = express();

const prisma = new PrismaClient();
const sw = require("stopword");

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
      const rawWords = review.toLowerCase().split(/\W+/);
      const filteredWords = sw.removeStopwords(rawWords);

      const Words = filteredWords.filter(
        (word) => word.length > 3 && englishwords.has(word)
      );

      for (const word of Words) {
        if (!word) continue;

        const existing = await prisma.mostfreq.findUnique({
          where: {
            word_productId: {
              word,
              productId,
            },
          },
        });

        if (existing) {
          await prisma.mostfreq.update({
            where: {
              word_productId: {
                word,
                productId,
              },
            },
            data: { count: existing.count + 1 },
          });
        } else {
          await prisma.mostfreq.create({
            data: { word, count: 1, productId },
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

app.get("/", (req, res) => {
  res.send("hii there");
});

app.get("/mfreq", async (req, res) => {
  const productId = parseInt(req.query.productId);
  const most_freq = await prisma.mostfreq.findMany({
    where: {
      count: {
        gt: 1,
      },
      productId,
    },
    orderBy: {
      count: "desc",
    },
    take: 5,
  });
  const words = most_freq.map((i) => i.word);
  res.json(words);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

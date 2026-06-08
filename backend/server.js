require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const app = express();

app.use(cors());
app.use(express.json());
const upload = multer({
  dest: "uploads/",
});

/* ======================
   TEST BACKEND
====================== */
app.get("/", (req, res) => {
  res.send("Backend berjalan!");
});

/* ======================
   PDRB
====================== */

// Ambil semua data PDRB
app.get("/api/pdrb", (req, res) => {
  db.query("SELECT * FROM pdrb", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Gagal mengambil data PDRB",
      });
    }

    res.json(result);
  });
});

// Tambah data PDRB
app.post("/api/pdrb", (req, res) => {
  const { tahun, kota, sektor, nilai_pdrb } = req.body;

  const sql = `
    INSERT INTO pdrb
    (tahun, kota, sektor, nilai_pdrb)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [tahun, kota, sektor, nilai_pdrb],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Gagal menambahkan data PDRB",
        });
      }

      res.json({
        message: "Data PDRB berhasil ditambahkan",
      });
    }
  );
});
app.put("/api/pdrb/:id", (req, res) => {
  const id = req.params.id;

  const {
    tahun,
    kota,
    sektor,
    nilai_pdrb,
  } = req.body;

  const sql = `
    UPDATE pdrb
    SET
      tahun = ?,
      kota = ?,
      sektor = ?,
      nilai_pdrb = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      tahun,
      kota,
      sektor,
      nilai_pdrb,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Gagal update data",
        });
      }

      res.json({
        message: "Data berhasil diupdate",
      });
    }
  );
});
// Hapus data PDRB
app.delete("/api/pdrb/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM pdrb WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Gagal menghapus data PDRB",
        });
      }

      res.json({
        message: "Data PDRB berhasil dihapus",
      });
    }
  );
});

app.post(
  "/api/pdrb/upload",
  upload.single("file"),
  (req, res) => {
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", () => {
        results.forEach((row) => {
          db.query(
            `
            INSERT INTO pdrb
            (tahun, kota, sektor, nilai_pdrb)
            VALUES (?, ?, ?, ?)
            `,
            [
              row.tahun,
              row.kota,
              row.sektor,
              row.nilai_pdrb,
            ]
          );
        });

        fs.unlinkSync(req.file.path);

        res.json({
          message:
            "CSV PDRB berhasil diupload",
        });
      });
  }
);
/* ======================
   KEMISKINAN
====================== */

// Ambil data kemiskinan
app.get("/api/kemiskinan", (req, res) => {
  db.query("SELECT * FROM kemiskinan", (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Gagal mengambil data kemiskinan",
      });
    }

    res.json(result);
  });
});

// Tambah data kemiskinan
app.post("/api/kemiskinan", (req, res) => {
  const {
    tahun,
    kota,
    jumlah_miskin,
    persentase,
  } = req.body;

  const sql = `
    INSERT INTO kemiskinan
    (tahun, kota, jumlah_miskin, persentase)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [tahun, kota, jumlah_miskin, persentase],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Gagal menambahkan data kemiskinan",
        });
      }

      res.json({
        message: "Data kemiskinan berhasil ditambahkan",
      });
    }
  );
});

app.put("/api/kemiskinan/:id", (req, res) => {
  const id = req.params.id;

  const {
    tahun,
    kota,
    jumlah_miskin,
    persentase,
  } = req.body;

  const sql = `
    UPDATE kemiskinan
    SET
      tahun = ?,
      kota = ?,
      jumlah_miskin = ?,
      persentase = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      tahun,
      kota,
      jumlah_miskin,
      persentase,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Gagal update data kemiskinan",
        });
      }

      res.json({
        message: "Data kemiskinan berhasil diupdate",
      });
    }
  );
});
app.delete("/api/kemiskinan/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM kemiskinan WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Gagal menghapus data kemiskinan",
        });
      }

      res.json({
        message: "Data kemiskinan berhasil dihapus",
      });
    }
  );
});
/* ======================
   PENGANGGURAN
====================== */

// Ambil data pengangguran
app.get("/api/pengangguran", (req, res) => {
  db.query("SELECT * FROM pengangguran", (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Gagal mengambil data pengangguran",
      });
    }

    res.json(result);
  });
});

// Tambah data pengangguran
app.post("/api/pengangguran", (req, res) => {
  const { tahun, kota, tpt } = req.body;

  const sql = `
    INSERT INTO pengangguran
    (tahun, kota, tpt)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [tahun, kota, tpt],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Gagal menambahkan data pengangguran",
        });
      }

      res.json({
        message: "Data pengangguran berhasil ditambahkan",
      });
    }
  );
});

app.put("/api/pengangguran/:id", (req, res) => {
  const id = req.params.id;

  const {
    tahun,
    kota,
    tpt,
  } = req.body;

  const sql = `
    UPDATE pengangguran
    SET
      tahun = ?,
      kota = ?,
      tpt = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      tahun,
      kota,
      tpt,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Gagal update data pengangguran",
        });
      }

      res.json({
        message: "Data pengangguran berhasil diupdate",
      });
    }
  );
});
// Hapus data pengangguran
app.delete("/api/pengangguran/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM pengangguran WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Gagal menghapus data pengangguran",
        });
      }

      res.json({
        message: "Data pengangguran berhasil dihapus",
      });
    }
  );
});

/* ======================
   START SERVER
====================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

app.get("/api/news", async (req, res) => {
  try {
    const response = await fetch(
      "https://gnews.io/api/v4/search?q=ekonomi%20indonesia&lang=id&max=6&apikey=43bb5d1024da6abb8a789102514f3c3b"
    );

    const data = await response.json();

    res.json(data.articles || []);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
});

app.get("/api/news", async (req, res) => {
  try {
    const response = await fetch(
      "https://gnews.io/api/v4/search?q=ekonomi&lang=id&max=6&apikey=43bb5d1024da6abb8a789102514f3c3b"
    );

    const data = await response.json();

    res.json(data.articles || []);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
});
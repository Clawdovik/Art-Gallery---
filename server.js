const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// 🔧 Подключение к SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './gallery.db',
  logging: false
});

// 🎨 МОДЕЛИ БАЗЫ ДАННЫХ

// Художники
const Artist = sequelize.define('Artist', {
  name: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  birthYear: {
    type: DataTypes.INTEGER
  },
  country: {
    type: DataTypes.STRING
  },
  biography: {
    type: DataTypes.TEXT
  }
});

// Картины
const Painting = sequelize.define('Painting', {
  title: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER
  },
  style: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  },
  imageUrl: {
    type: DataTypes.STRING
  },
  price: {
    type: DataTypes.DECIMAL(10, 2)
  }
});

// Связь: Художник имеет много картин
Artist.hasMany(Painting);
Painting.belongsTo(Artist);

// 🖼️ ДАННЫЕ ДЛЯ ГАЛЕРЕИ
const artistsData = [
  {
    name: "Винсент Ван Гог",
    birthYear: 1853,
    country: "Нидерланды",
    biography: "Постимпрессионист, автор знаменитых «Подсолнухов» и «Звёздной ночи»",
    Paintings: [
      {
        title: "Звёздная ночь",
        year: 1889,
        style: "Постимпрессионизм",
        description: "Одна из самых узнаваемых картин в истории западного искусства",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
        price: 95000000
      },
      {
        title: "Подсолнухи",
        year: 1888,
        style: "Постимпрессионизм",
        description: "Серия натюрмортов с подсолнухами в вазе",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vincent_Willem_van_Gogh_127.jpg/800px-Vincent_Willem_van_Gogh_127.jpg",
        price: 72000000
      }
    ]
  },
  {
    name: "Леонардо да Винчи",
    birthYear: 1452,
    country: "Италия",
    biography: "Титан Возрождения, учёный, изобретатель, художник",
    Paintings: [
      {
        title: "Мона Лиза",
        year: 1503,
        style: "Возрождение",
        description: "Портрет Лизы дель Джокондо, самая известная картина в мире",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
        price: 860000000
      },
      {
        title: "Тайная вечеря",
        year: 1495,
        style: "Возрождение",
        description: "Фреска с изображением последней трапезы Христа с учениками",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%C3%9Altima_Cena_-_Da_Vinci_5.jpg/800px-%C3%9Altima_Cena_-_Da_Vinci_5.jpg",
        price: 450000000
      }
    ]
  },
  {
    name: "Пабло Пикассо",
    birthYear: 1881,
    country: "Испания",
    biography: "Основоположник кубизма, один из самых влиятельных художников XX века",
    Paintings: [
      {
        title: "Герника",
        year: 1937,
        style: "Кубизм",
        description: "Антивоенная картина, изображающая бомбардировку Герники",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/PicassoGuernica.jpg/800px-PicassoGuernica.jpg",
        price: 200000000
      },
      {
        title: "Авиньонские девицы",
        year: 1907,
        style: "Кубизм",
        description: "Картина, ознаменовавшая начало кубизма",
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Les_Demoiselles_d%27Avignon.jpg/800px-Les_Demoiselles_d%27Avignon.jpg",
        price: 120000000
      }
    ]
  },
  {
    name: "Клод Моне",
    birthYear: 1840,
    country: "Франция",
    biography: "Основатель импрессионизма, мастер пленэрной живописи",
    Paintings: [
      {
        title: "Впечатление. Восходящее солнце",
        year: 1872,
        style: "Импрессионизм",
        description: "Картина, давшая название движению импрессионистов",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Monet_-_Impression%2C_Sunrise.jpg/800px-Monet_-_Impression%2C_Sunrise.jpg",
        price: 85000000
      },
      {
        title: "Водяные лилии",
        year: 1916,
        style: "Импрессионизм",
        description: "Серия картин с прудом в саду Моне в Живерни",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg/800px-Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg",
        price: 54000000
      }
    ]
  }
];

// 🗃️ ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ
async function initializeDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log('🔄 Creating gallery database...');
    
    // Создаем художников с их картинами
    for (const artistData of artistsData) {
      const artist = await Artist.create(artistData, {
        include: [Painting]
      });
      console.log(`✅ Added artist: ${artist.name}`);
    }
    
    console.log('🎉 Gallery database ready!');
    return true;
  } catch (error) {
    console.log('❌ Database error:', error.message);
    return false;
  }
}

// 🌐 API МАРШРУТЫ

// Главная страница
app.get('/', (req, res) => {
  res.json({
    message: "🎨 Добро пожаловать в Картинную Галерею!",
    endpoints: {
      artists: "/artists - все художники",
      paintings: "/paintings - все картины", 
      artistById: "/artists/:id - художник по ID",
      paintingsByArtist: "/artists/:id/paintings - картины художника",
      search: "/search?q=... - поиск по названию"
    },
    database: "SQLite Gallery",
    status: "🟢 ONLINE"
  });
});

// Все художники
app.get('/artists', async (req, res) => {
  try {
    const artists = await Artist.findAll({
      include: [Painting],
      order: [['name', 'ASC']]
    });
    res.json({
      count: artists.length,
      artists: artists
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Все картины
app.get('/paintings', async (req, res) => {
  try {
    const paintings = await Painting.findAll({
      include: [Artist],
      order: [['year', 'DESC']]
    });
    res.json({
      count: paintings.length,
      paintings: paintings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Художник по ID
app.get('/artists/:id', async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id, {
      include: [Painting]
    });
    if (artist) {
      res.json(artist);
    } else {
      res.status(404).json({ error: 'Художник не найден' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Картины художника
app.get('/artists/:id/paintings', async (req, res) => {
  try {
    const paintings = await Painting.findAll({
      where: { ArtistId: req.params.id },
      include: [Artist]
    });
    res.json({
      count: paintings.length,
      paintings: paintings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Поиск картин
app.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Необходим параметр поиска ?q=' });
    }
    
    const paintings = await Painting.findAll({
      where: {
        title: {
          [Sequelize.Op.like]: `%${query}%`
        }
      },
      include: [Artist]
    });
    
    res.json({
      query: query,
      count: paintings.length,
      paintings: paintings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🚀 ЗАПУСК СЕРВЕРА
const PORT = 8080;

app.listen(PORT, async () => {
  console.log('='.repeat(60));
  console.log('🎨 CARTHOUSE GALLERY - Картинная Галерея');
  console.log('='.repeat(60));
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
  console.log('');
  console.log('📊 Доступные API endpoints:');
  console.log(`   📍 Главная: http://localhost:${PORT}`);
  console.log(`   👨‍🎨 Художники: http://localhost:${PORT}/artists`);
  console.log(`   🖼️  Все картины: http://localhost:${PORT}/paintings`);
  console.log(`   🔍 Поиск: http://localhost:${PORT}/search?q=Мона`);
  console.log(`   👨‍🎨 Ван Гог: http://localhost:${PORT}/artists/1`);
  console.log('');
  
  await initializeDatabase();
  console.log('');
  console.log('✨ Галерея готова к просмотру!');
});
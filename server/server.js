// server/server.js
require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');

const User = require('./src/models/User');
const Category = require('./src/models/Category');
const ContentItem = require('./src/models/ContentItem');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined. Please set it in your .env file (server/.env).");
    process.exit(1);
}

const PORT = process.env.PORT || 3001;

async function seedDatabase() {
    try {
        const categoriesCount = await Category.count();
        let featured, news, action, drama, comedy; // Variáveis para IDs das categorias

        if (categoriesCount === 0) {
            console.log('Seeding categories...');
            featured = await Category.create({ name: 'Em Destaque', slug: 'em-destaque' });
            news = await Category.create({ name: 'Novidades', slug: 'novidades' });
            action = await Category.create({ name: 'Ação', slug: 'acao' });
            drama = await Category.create({ name: 'Drama', slug: 'drama' });
            comedy = await Category.create({ name: 'Comédia', slug: 'comedia' });
            console.log('Categories seeded.');
        } else {
            // Se as categorias já existem, busca os IDs
            featured = await Category.findOne({ where: { slug: 'em-destaque' } });
            news = await Category.findOne({ where: { slug: 'novidades' } });
            action = await Category.findOne({ where: { slug: 'acao' } });
            drama = await Category.findOne({ where: { slug: 'drama' } });
            comedy = await Category.findOne({ where: { slug: 'comedia' } });
        }

        // Garante que temos os IDs das categorias antes de popular ContentItems
        if (!featured || !news || !action || !drama || !comedy) {
            console.error('Error: Could not find all required categories for seeding content items. Check if categories were created.');
            const existingCategories = await Category.findAll(); // Log para debug
            console.log('Existing categories in DB:', existingCategories.map(c => ({id: c.id, name: c.name, slug: c.slug })));
            return;
        }

        const contentItemsCount = await ContentItem.count();
        if (contentItemsCount === 0) {
            console.log('Seeding content items...');
            await ContentItem.bulkCreate([
                // --- Em Destaque ---
                { 
                    title: 'Guardiões da Galáxia Vol. 3', 
                    description: 'Peter Quill, ainda se recuperando da perda de Gamora, precisa reunir sua equipe para defender o universo e proteger um dos seus.', 
                    posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/4yycSPnchdNAZirGkmCYQwTd3cr.jpg',
                    trailerUrl: 'https://www.youtube.com/embed/tqot0Ws2wFs?si=lO7xhMBjRJneHJHC', // Formato de embed
                    releaseYear: 2023, 
                    contentType: 'movie', 
                    categoryId: featured.id 
                },
                { 
                    title: 'The Mandalorian', 
                    description: 'Após as histórias de Jango e Boba Fett, outro guerreiro emerge no universo Star Wars.', 
                    posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg',
                    trailerUrl: 'https://www.youtube.com/embed/rV-BmMbWEj4?si=BRnzVXgplY84ZqU7', // Formato de embed
                    releaseYear: 2019, 
                    contentType: 'series', 
                    categoryId: featured.id 
                },
                { 
                    title: 'Oppenheimer', 
                    description: 'A história do físico americano J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica.',
                    posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/1OsQJEoSXBjduuCvDOlRhoEUaHu.jpg',
                    trailerUrl: 'https://www.youtube.com/embed/F3OxA9Cz17A?si=BnHl-1K4kPEBbHCU', // Formato de embed
                    releaseYear: 2023, 
                    contentType: 'movie', 
                    categoryId: drama.id 
                },
                // --- Novidades ---
                { 
                    title: 'The Last of Us', 
                    description: 'Joel e Ellie, uma dupla conectada por meio da dureza do mundo em que vivem, são forçados a suportar circunstâncias brutais e assassinos implacáveis em uma jornada pela América pós-pandêmica.', 
                    posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/el1KQzwdIm17I3A6cYPfsVIWhfX.jpg',
                    trailerUrl: 'https://www.youtube.com/embed/lW5kiEUVlpo?si=_XtW5fRanZgP_f3d', // Formato de embed
                    releaseYear: 2023, 
                    contentType: 'series', 
                    categoryId: news.id 
                },
                { 
                    title: 'Avatar: O Caminho da Água', 
                    description: 'Jake Sully vive com sua nova família formada no planeta Pandora. Uma vez que uma ameaça familiar retorna para terminar o que foi iniciado anteriormente, Jake deve trabalhar com Neytiri e o exército da raça Na\'vi para proteger seu planeta.', 
                    posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/mbYQLLluS651W89jO7MOZcLSCUw.jpg',
                    trailerUrl: 'https://www.youtube.com/embed/V-0GkangoHM?si=cCV_9yykB7naA-pC', // Formato de embed (corrigido de youtu.be)
                    releaseYear: 2022, 
                    contentType: 'movie', 
                    categoryId: news.id 
                },
                 // --- Ação ---
                { 
                    title: 'John Wick 4: Baba Yaga', 
                    description: 'Com o preço por sua cabeça cada vez maior, John Wick leva sua luta contra a Alta Cúpula de forma global.', 
                    posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/dHQEM7aqsvBQnPmjdyTgb5fUG5q.jpg',
                    trailerUrl: 'https://www.youtube.com/embed/Te3L5rT1Q8w?si=azQLFIvRuQ7UWbli', // Formato de embed
                    releaseYear: 2023, 
                    contentType: 'movie', 
                    categoryId: action.id 
                },
                { 
                    title: 'Velozes & Furiosos 10', 
                    description: 'Dom Toretto e sua família devem lidar com o adversário mais letal que já enfrentaram.', 
                    posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/wDWAA5QApz5L5BKfFaaj8HJCAQM.jpg',
                    trailerUrl: 'https://www.youtube.com/embed/F2-BLKAidao?si=gxEfJklmz9QeN9Mi', // Formato de embed
                    releaseYear: 2023, 
                    contentType: 'movie', 
                    categoryId: action.id 
                },
                // --- Comédia ---
                 { 
                    title: 'Barbie', 
                    description: 'Depois de ser expulsa da Barbieland por ser uma boneca de aparência menos do que perfeita, Barbie parte para o mundo humano em busca da verdadeira felicidade.', 
                    posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/yRRuLt7sMBEQkHsd1S3KaaofZn7.jpg',
                    trailerUrl: 'https://www.youtube.com/embed/2GTkvVeak9w?si=8tBjePdslIFXWm4p', // Formato de embed
                    releaseYear: 2023, 
                    contentType: 'movie', 
                    categoryId: comedy.id 
                },

            ]);
            console.log('Content items seeded.');
        } else {
            console.log('Content items already exist, skipping seed.');
        }
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        
        // CORREÇÃO: Definir a constante syncForce AQUI DENTRO
        const syncForce = false; // Defina como true APENAS para recriar tabelas e rodar o seed UMA VEZ
                                 // Depois, volte para false.

        await sequelize.sync({ force: syncForce }); 
        console.log(`All models were synchronized successfully. (force: ${syncForce})`);

        if (syncForce) { 
            await seedDatabase();
        } else { 
             const categoriesCount = await Category.count();
             const contentItemsCount = await ContentItem.count();
             if (categoriesCount === 0 || contentItemsCount === 0) {
                 console.log('Attempting to seed database as it appears to be empty or partially empty...');
                 await seedDatabase();
             } else {
                 console.log('Database already contains data, skipping seed.');
             }
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database or start server:', error);
    }
}

startServer();
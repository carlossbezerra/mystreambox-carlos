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
        let featured, news, action, drama, comedy, terror, aventura; // Novas categorias

        if (categoriesCount === 0) {
            console.log('Seeding categories...');
            featured = await Category.create({ name: 'Em Destaque', slug: 'em-destaque' });
            news = await Category.create({ name: 'Novidades', slug: 'novidades' });
            action = await Category.create({ name: 'Ação', slug: 'acao' });
            drama = await Category.create({ name: 'Drama', slug: 'drama' });
            comedy = await Category.create({ name: 'Comédia', slug: 'comedia' });
            terror = await Category.create({ name: 'Terror', slug: 'terror' });     // NOVA
            aventura = await Category.create({ name: 'Aventura', slug: 'aventura' }); // NOVA
            console.log('Categories seeded.');
        } else {
            featured = await Category.findOne({ where: { slug: 'em-destaque' } });
            news = await Category.findOne({ where: { slug: 'novidades' } });
            action = await Category.findOne({ where: { slug: 'acao' } });
            drama = await Category.findOne({ where: { slug: 'drama' } });
            comedy = await Category.findOne({ where: { slug: 'comedia' } });
            terror = await Category.findOne({ where: { slug: 'terror' } });         // NOVA
            aventura = await Category.findOne({ where: { slug: 'aventura' } });     // NOVA
        }

        if (!featured || !news || !action || !drama || !comedy || !terror || !aventura) {
            console.error('Error: Could not find/create all required categories for seeding. Current categories:');
            const existingCategories = await Category.findAll();
            console.log(existingCategories.map(c => ({ id: c.id, name: c.name, slug: c.slug })));
            return;
        }

        const contentItemsCount = await ContentItem.count();
        if (contentItemsCount === 0) {
            console.log('Seeding content items (this may take a moment for ~70 items)...');
            const itemsToCreate = [];

            // Helper para criar URLs de placeholder mais variados
            const placeholderPoster = (text, color1 = '333', color2 = 'fff') => `https://via.placeholder.com/300x450/${color1}/${color2}?Text=${encodeURIComponent(text)}`;
            const placeholderTrailer = 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Rick Astley

            // --- Em Destaque (10 itens - alguns podem ser de outras categorias principais) ---
            const destaqueItems = [
                { title: 'Guardiões da Galáxia Vol. 3', description: 'Peter Quill...', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/4yycSPnchdNAZirGkmCYQwTd3cr.jpg', trailerUrl: 'https://www.youtube.com/embed/zmdkP8K8X7o?si=uk2BAjjXJTmpK6Ih', releaseYear: 2023, contentType: 'movie', categoryId: featured.id },
                { title: 'The Mandalorian', description: 'O Mandaloriano e Grogu continuam sua jornada.', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg', trailerUrl: 'https://www.youtube.com/embed/rV-BmMbWEj4?si=XHxEIDbCxQ2sAyl3', releaseYear: 2019, contentType: 'series', categoryId: featured.id },
                { title: 'Super Mario Bros. O Filme', description: 'Os irmãos Mario e Luigi em uma aventura no Reino Cogumelo.', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/ktU3MIeZtuEVRlMftgp0HMX2WR7.jpg', trailerUrl: 'https://www.youtube.com/embed/iL6-Q62CjbA?si=BPCPn87_I-fdroj2', releaseYear: 2023, contentType: 'movie', categoryId: featured.id },
                { title: 'Dungeons & Dragons: Honra Entre Rebeldes', description: 'Um ladrão encantador e um bando de aventureiros.', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/mVY4DbjYc1hqHnhgJt8rtEqEgfU.jpg', trailerUrl: 'https://www.youtube.com/embed/PtewyAANr34?si=RklknN1SH9yh0uwW', releaseYear: 2023, contentType: 'movie', categoryId: aventura.id }, // Também Aventura
                { title: 'Succession - Temporada Final', description: 'A luta pelo poder na família Roy.', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/z0XiwdrCQ9yVIr4O0pxzaAYRxdW.jpg', trailerUrl: 'https://www.youtube.com/embed/pBwmmy0KFzM?si=eFXUM5efP8O-mUsV', releaseYear: 2018, contentType: 'series', categoryId: drama.id }, // Também Drama
                { title: 'Premonição 6: Laços de Sangue', description: 'Atormentada por um pesadelo violento recorrente....', posterUrl:'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/j8c47GIu7kpNPi8gsSR8jQBjYBB.jpg', trailerUrl:'https://www.youtube.com/embed/x4xsMz-L4hk?si=8-4GBUOjUxFduE5B', releaseYear: 2025, contentType: 'movie', categoryId: featured.id },
                { title: 'Thunderbolts', description: 'Depois de se verem presos em uma armadilha mortal..', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/eKD2p840nsRXLUR25ciVsNMJgOB.jpg', trailerUrl:'https://www.youtube.com/embed/sXGZbXPjdUs?si=Y75PC05A3pbRQLpb', releaseYear: 2025, contentType: 'series', categoryId: featured.id },
                { title: 'Karatê Kid: Lendas', description: 'Após uma tragédia familiar, o prodígio do kung fu Li Fong é forçado a deixar sua casa..', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/gnuSSOVBVWlKL8dFEGKRoOiiKTS.jpg', trailerUrl: 'https://www.youtube.com/embed/jdZPKED0Dqg?si=s6E15p04u5Hf2JBb', releaseYear: 2025, contentType: 'movie', categoryId: featured.id },
                { title: 'Pecadores', description: 'Dispostos a deixar suas vidas conturbadas para trás, irmãos gêmeos retornam à sua cidade natal....', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/a9kYEboW1TQaeilGYUAx1MO0DUp.jpg', trailerUrl:'https://www.youtube.com/embed/e9kwQahD8YY?si=nxGQdYXBDA-_HSny', releaseYear: 2025, contentType: 'series', categoryId: featured.id },
                { title: 'Memórias de um Caracol', description: 'Após uma série de infortúnios, uma desajustada e melancólica colecionadora de caracóis..', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/zeFRmFslWFp8GqbFfzUgwZb2ufW.jpg', trailerUrl: 'https://www.youtube.com/embed/vffb57YG2Tw?si=pvBzbggyd-nZIljp" title="YouTube video player', releaseYear: 2025, contentType: 'movie', categoryId: featured.id },
            ];
            itemsToCreate.push(...destaqueItems);

            // --- Novidades (10 itens) ---
            const novidadesItems = [
                { title: 'The Last of Us', description: 'Joel e Ellie...', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/el1KQzwdIm17I3A6cYPfsVIWhfX.jpg', trailerUrl: 'https://www.youtube.com/embed/lW5kiEUVlpo?si=Xn-p19tjcqFO9M5Z', releaseYear: 2023, contentType: 'series', categoryId: news.id },
                { title: 'Avatar: O Caminho da Água', description: 'Jake Sully vive...', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/mbYQLLluS651W89jO7MOZcLSCUw.jpg', trailerUrl: 'https://www.youtube.com/embed/V-0GkangoHM?si=_UyiG-mDrzXOrKed', releaseYear: 2022, contentType: 'movie', categoryId: news.id },
                { title: 'Until Dawn', description: 'Um ano após o misterioso desaparecimento de sua irmã Melanie....', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/95YgqGDuUNSGrx5Obz51tlQLwWb.jpg', trailerUrl:'https://www.youtube.com/embed/W--kUNMg1-E?si=z3BzhS35kEbJVYC4', releaseYear: 2025, contentType: 'movie', categoryId: news.id },
                { title: 'Hurry Up Tomorrow', description: 'Um músico atormentado pela insônia..', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/9W44XSMYbjXdlXcQhD104zPhhhJ.jpg', trailerUrl:'https://www.youtube.com/embed/jcvSpRpnkvY?si=IK0y4g5HT2oLhAjk', releaseYear: 2025, contentType: 'movie', categoryId: news.id },
                { title: 'Operação Vingança', description: 'Depois que sua esposa é tragicamente morta..', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/bAQAGxxqwK8bcqEYLEo6cN7UNn6.jpg', trailerUrl:'https://www.youtube.com/embed/y3YWAXJKPes?si=f2eNYS14oAIEDhTM', releaseYear: 2025, contentType: 'movie', categoryId: news.id },
                { title: 'Amor Bandido', description: 'Um corretor de imóveis é puxado de volta para a vida..', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/us125MW4IQOiGbnl77NgOJVEgMn.jpg', trailerUrl:'https://www.youtube.com/embed/bcYYnRdckUc?si=-srwX0TaOoOQbyZK', releaseYear: 2025, contentType: 'movie', categoryId: news.id },
                { title: '12.12: O Dia', description: 'Após o assassinato do Presidente Park...', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/cxdSpmtAl1jtKQBDkakvdkinMi2.jpg', trailerUrl:'https://www.youtube.com/embed/dnM5j9oeHms?si=koQqGn4SHkA1sFW4', releaseYear: 2023, contentType: 'movie', categoryId: news.id },
                { title: 'O Rei dos Reis', description: 'Um pai compartilha com seu filho a maior história de todos os tempos...', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/3Mz71kubfEj5Ko0SZRTHKQlsCZj.jpg', trailerUrl:'https://www.youtube.com/embed/OIwWFJB-VuQ?si=tx6lAYOkqEGS-ju3', releaseYear: 2025, contentType: 'movie', categoryId: news.id },
                { title: 'Looney Tunes - O Filme: O Dia Que a Terra Explodiu', description: 'Gaguinho e Patolino, a clássica dupla estranha animada..', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/7iV0ngs6t0A0cZJ2HekryTmOJTX.jpg', trailerUrl:'https://www.youtube.com/embed/JBT-iG_B-00?si=xwvRF_xXGWbjXSfz', releaseYear: 2025, contentType: 'movie', categoryId: news.id },
                { title: 'Screamboat: Terror a Bordo', description: 'Na última balsa da noite em Nova York..', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/pGT6WrELDqWRtOd0H4H3lTGpO0y.jpg', trailerUrl:'https://www.youtube.com/embed/OrdUCw56mBY?si=xJg2TfyDWo2URnL2', releaseYear: 2025, contentType: 'movie', categoryId: news.id },
            ];
            itemsToCreate.push(...novidadesItems);

            // --- Ação (10 itens) ---
            const acaoItems = [
                { title: 'John Wick 4: Baba Yaga', description: 'Com o preço...', posterUrl: 'https://media.themoviedb.org/t/p/w300_and_h900_bestv2/dHQEM7aqsvBQnPmjdyTgb5fUG5q.jpg', trailerUrl: 'https://www.youtube.com/embed/Te3L5rT1Q8w', releaseYear: 2023, contentType: 'movie', categoryId: action.id },
                { title: 'Velozes & Furiosos 10', description: 'Dom Toretto...', posterUrl: 'https://media.themoviedb.org/t/p/w300_and_h900_bestv2/wDWAA5QApz5L5BKfFaaj8HJCAQM.jpg', trailerUrl: 'https://www.youtube.com/embed/F2-BLKAidao', releaseYear: 2023, contentType: 'movie', categoryId: action.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, contentType: 'movie', categoryId: action.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, contentType: 'movie', categoryId: action.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, contentType: 'movie', categoryId: action.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, contentType: 'movie', categoryId: action.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, contentType: 'movie', categoryId: action.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, contentType: 'movie', categoryId: action.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, contentType: 'movie', categoryId: action.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, contentType: 'movie', categoryId: action.id },                         
            ];
            itemsToCreate.push(...acaoItems);

            // --- Drama (10 itens) ---
            const dramaItemsSeed = [ // Renomeado para evitar conflito com a variável da categoria
                { title: 'Oppenheimer', description: 'A história do físico...', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/1OsQJEoSXBjduuCvDOlRhoEUaHu.jpg', trailerUrl: 'https://www.youtube.com/embed/F3OxA9Cz17A', releaseYear: 2023, contentType: 'movie', categoryId: drama.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, contentType: 'movie', categoryId: drama.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, contentType: 'movie', categoryId: drama.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, contentType: 'movie', categoryId: drama.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, contentType: 'movie', categoryId: drama.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, contentType: 'movie', categoryId: drama.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, contentType: 'movie', categoryId: drama.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, contentType: 'movie', categoryId: drama.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, contentType: 'movie', categoryId: drama.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, contentType: 'movie', categoryId: drama.id },
            ];
            itemsToCreate.push(...dramaItemsSeed);

            // --- Comédia (10 itens) ---
            const comediaItemsSeed = [
                { title: 'Barbie', description: 'Depois de ser expulsa...', posterUrl: 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/yRRuLt7sMBEQkHsd1S3KaaofZn7.jpg', trailerUrl: 'https://www.youtube.com/embed/2GTkvVeak9w', releaseYear: 2023, contentType: 'movie', categoryId: comedy.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: comedy.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: comedy.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: comedy.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: comedy.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: comedy.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: comedy.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: comedy.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: comedy.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: comedy.id },
            ];
            itemsToCreate.push(...comediaItemsSeed);

            // --- Terror (10 itens) ---
            const terrorItemsSeed = [
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: terror.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: terror.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: terror.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: terror.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: terror.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: terror.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: terror.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: terror.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: terror.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: terror.id },
            ];
            itemsToCreate.push(...terrorItemsSeed);

            // --- Aventura (10 itens) ---
            const aventuraItemsSeed = [
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: aventura.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: aventura.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: aventura.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: aventura.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: aventura.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: aventura.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: aventura.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: aventura.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: aventura.id },
                { title: '', description: '', posterUrl: '', trailerUrl:'', releaseYear: 2025, releaseYear: 2025, contentType: 'movie', categoryId: aventura.id },
            ];
            itemsToCreate.push(...aventuraItemsSeed);


            await ContentItem.bulkCreate(itemsToCreate);
            console.log(`${itemsToCreate.length} content items seeded.`);
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
        
        const syncForce = false; // ATENÇÃO: Mude para true APENAS para recriar tabelas e rodar o seed UMA VEZ. Depois, volte para false.

        await sequelize.sync({ force: syncForce }); 
        console.log(`All models were synchronized successfully. (force: ${syncForce})`);

        if (syncForce) { 
            await seedDatabase();
        } else { 
             const categoriesCount = await Category.count();
             const contentItemsCount = await ContentItem.count();
             // Se alguma categoria está faltando ou não há itens, tenta rodar o seed
             // (Considera 7 categorias: featured, news, action, drama, comedy, terror, aventura)
             if (categoriesCount < 7 || contentItemsCount === 0) { 
                 console.log('Attempting to seed database as it appears to be empty, partially empty, or missing categories...');
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
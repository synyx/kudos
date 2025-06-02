<div align="center">
    <img src="res/kudo-monster.svg">
</div>

# Kudos

👏 **Kudos** is a versatile and interactive web application, meticulously crafted to revolutionize the way you appreciate and celebrate your colleagues in the workplace. Kudos allows you not only to send tailor-made "Kudo" cards, but also to enhance them with your personal touch.

Transform your workplace culture by celebrating individual and team accomplishments, fostering positive reinforcement, and promoting an atmosphere of genuine appreciation with Kudos!

## 🌟 Features

📝 **Personalized Text**: Add heartfelt messages to let your colleagues know how much they mean to you.

🎴 **Multiple Templates**: Choose from a variety of templates to suit the occasion.

🎨 **Drawing Functionality**: Unleash your creativity by drawing directly on the card for that extra personal touch.

🎉 **Presentation Mode**:
Planning to showcase the Kudos in a team meeting or special occasion? Switch to Presentation Mode, where you can shuffle through all received cards and celebrate together as a team.

🗂 **Archiving**:
Keep track of all the positive vibes by utilizing our archiving functionality. Save cherished moments and revisit them any time you need a morale boost.

## Developing

To get you up and running you need to run the following steps:

1. Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) and install the required NodeJS version with `nvm install`
2. Make sure you run the correct NodeJS version with `nvm use`
3. Install dependencies with `npm install`
4. Configure db connection with environment variable (eg. via `.env` file) `DATABASE_URL="postgres://kudos:secret@localhost:5432/kudos?schema=public"`
5. Start db with `docker compose up`
6. Run db migrations with `npm run db:migrate`
7. Start local dev server with `npm run dev`

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

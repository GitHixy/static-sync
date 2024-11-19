const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/User');

passport.use(

    new DiscordStrategy(
        {
            clientID: `${process.env.DISCORD_CLIENT_ID}`,
            clientSecret: `${process.env.DISCORD_CLIENT_SECRET}`,
            callbackURL: `${process.env.BASE_API_URL}/api/discord/callback`,
            scope: ['identify', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const { id, username, discriminator, avatar } = profile;
                const email = profile.email || `${id}@discord.com`; 

                
                let user = await User.findOne({ 'discord.id': id });
                if (!user) {
                    user = new User({
                        username,
                        email,
                        discord: { id, username, discriminator, avatar },
                    });
                    await user.save();
                }
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);


passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

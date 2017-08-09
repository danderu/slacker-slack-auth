const { send } = require('micro');
const microAuthSlack = require('microauth-slack');
const { router, get } = require('microrouter');

const options = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackUrl: `${process.env.APPLICATION_URL}/auth/slack/callback`,
  path: '/auth/slack',
  scope: 'identity.basic,identity.team,identity.avatar'
};

const slackAuth = microAuthSlack(options);

const hello = (req, res) =>
  send(res, 200, `Hello ${req.params.who}`)

const handler = async (req, res, auth) => {

  if (!auth) {
    return send(res, 404, 'Not Found');
  }

  if (auth.err) {
    // Error handler
    return send(res, 403, 'Forbidden');
  }

  return {
    accessToken: auth.result.accessToken,
    team: {
      name: auth.result.info.team.name,
      domain: auth.result.info.team.domain,
      logo: auth.result.info.team.image_230
    },
    user: {
      name: auth.result.info.user.name,
      avatar: auth.result.info.user.image_192
    }
  };

};

module.exports = router(
  get('/hello/:who', hello),
  slackAuth(handler)
);
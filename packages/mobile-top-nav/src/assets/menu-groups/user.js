
const userMenu = {
  profileImgUrl: '/services/img/user/profile',
  loggedOut: [
    {
      link: '/account/login',
      label: 'Log in'
    }
  ],
  loggedIn: [
    {
      link: '/create',
      label: 'Upload'
    },
    {
      link: '/details/@username',
      label: 'My library'
    },
    {
      link: '/details/@username?tab=loans',
      label: 'My loans'
    },
    {
      link: '/details/fav_user-name',
      label: 'My favorites'
    },
    {
      link: '/details/',
      label: 'My web archive'
    },
    {
      link: '/account/index.php?settings=1',
      label: 'Edit Settings'
    },
    {
      link: 'https://help.archive.org',
      label: 'Get help'
    },
    {
      link: '/account/logout',
      label: 'Log out'
    },
  ],
};

export default userMenu;

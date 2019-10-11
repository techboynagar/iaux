const books = {
  main: 'books',
  highlighted: {
    'inlibrary?sort=-publicdate': 'Books to Borrow',
    'openlibrary.org': {
      link: true,
      img: '/images/widgetOL.png',
      label: 'Open Library',
    },
  },
  featured: {
    smithsonian: 'Smithsonian Libraries',
    fedlink: 'FEDLINK (US)',
    genealogy: 'Genealogy',
    lincolncollection: 'Lincoln Collection',
    additional_collections: 'Additional Collections',
  },
  top: {
    americana: 'American Libraries',
    toronto: 'Canadian Libraries',
    universallibrary: 'Universal Library',
    opensource: 'Community Texts',
    gutenberg: 'Project Gutenberg',
    biodiversity: 'Biodiversity Heritage Library',
    iacl: "Children's Library",
    booksbylanguage: 'Books by Language',
  },
};

export default books;

import React from 'react';

const ImageGrid = () => {
  const images = [
    {
      id: 1,
      base64SVG: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBpZD0icmVjdGFuZ2xlIiBoZWlnaHQ9IjUwMCIgd2lkdGg9IjUwMCIgcng9IjI1IiByeT0iMjUiLz48dGV4dCB4PSI1MCUiIHk9IjUyJSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtZmFtaWx5PSJNb25vc3BhY2UiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9ImhzbCgyMDYsIDEwMCUsIDM2JSkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTUiPklzIHRoZSB3b3JkIHJlbGF0ZWQgdG8gdGVjaG5vbG9neSBvciBfXz88L3RleHQ+PC9zdmc+',
      title: 'Words NFT #1',
      description: 'This is the description for image 1.',
    },
    {
      id: 2,
      base64SVG: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBpZD0icmVjdGFuZ2xlIiBoZWlnaHQ9IjUwMCIgd2lkdGg9IjUwMCIgcng9IjI1IiByeT0iMjUiLz48dGV4dCB4PSI1MCUiIHk9IjUyJSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtZmFtaWx5PSJNb25vc3BhY2UiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9ImhzbCgyMDYsIDEwMCUsIDM2JSkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTUiPkNhbiB0aGUgd29yZCBiZSBlYXRlbiBvciBfXz88L3RleHQ+PC9zdmc+',
      title: 'Words NFT #2',
      description: 'This is the description for image 2.',
    },
    {
      id: 3,
      base64SVG: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBpZD0icmVjdGFuZ2xlIiBoZWlnaHQ9IjUwMCIgd2lkdGg9IjUwMCIgcng9IjI1IiByeT0iMjUiLz48dGV4dCB4PSI1MCUiIHk9IjUyJSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtZmFtaWx5PSJNb25vc3BhY2UiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9ImhzbCgyMDYsIDEwMCUsIDM2JSkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTUiPklzIHRoZSB3b3JkIHNvbWV0aGluZyB5b3UgY2FuIF9fPzwvdGV4dD48L3N2Zz4=',
      title: 'Words NFT #3',
      description: 'This is the description for image 3.',
    },
    {
      id: 4,
      base64SVG: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBpZD0icmVjdGFuZ2xlIiBoZWlnaHQ9IjUwMCIgd2lkdGg9IjUwMCIgcng9IjI1IiByeT0iMjUiLz48dGV4dCB4PSI1MCUiIHk9IjUyJSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtZmFtaWx5PSJNb25vc3BhY2UiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9ImhzbCgyMDYsIDEwMCUsIDM2JSkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTUiPkRvZXMgdGhlIHdvcmQgcmVwcmVzZW50IGFuIGVtb3Rpb24gb3IgX18/PC90ZXh0Pjwvc3ZnPg==',
      title: 'Words NFT #4',
      description: 'This is the description for image 4.',
    },
    {
      id: 5,
      base64SVG: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBpZD0icmVjdGFuZ2xlIiBoZWlnaHQ9IjUwMCIgd2lkdGg9IjUwMCIgcng9IjI1IiByeT0iMjUiLz48dGV4dCB4PSI1MCUiIHk9IjUyJSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtZmFtaWx5PSJNb25vc3BhY2UiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9ImhzbCgyMDYsIDEwMCUsIDM2JSkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTUiPkNhbiB0aGUgd29yZCBiZSB1c2VkIGluIGEgX18/PC90ZXh0Pjwvc3ZnPg==',
      title: 'Words NFT #5',
      description: 'This is the description for image 5.',
    },




  ];

  return (
    <div className="grid grid-cols-3 gap-8">
      {images.map((image) => (
        <div key={image.id} className="p-2 border border-gray-300">
          <img src={image.base64SVG} alt={image.title} className="w-full h-auto" />
          <h2 className="text-lg font-bold mt-2">{image.title}</h2>
          <p className="mt-1">{image.description}</p>
        </div>
      ))}
      <div className="p-2 border border-gray-300" style = {{ textAlign :'center' , margin :'Auto'}}>
        <h1> And many more..</h1>
      </div>

    </div>
  );
};


export default ImageGrid;

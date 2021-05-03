export const maps=
        [{
           
            "id": 1,
            "name": "The World",
            "owner": {
              "_id": {
                "$oid": "607a4b694e11f647ef3b1c41"
              },
              "name": "admin",
              "email": "admin@gmail.com",
              "password": "$2y$10$aNiHh9oIFsOLN4NAJQjcgOaku39koVSlwAxWrM8ZoKxbt9TGTF3Sm"
            }
          },
        ]

export const landmarks = [
  {
    id: "1",
    name: "Empire State Building - New York"
  },
  {
    id: "2",
    name: "Grand Canyon - Arizona"
  },
  {
    id: "3",
    name: "Washington Monument"
  },
  {
    id: "4",
    name: "YellowStone National Park - Wyoming"
  },
]

export const regions= [
    {
    id: "1",
    name : "North American",
    subRegion : [
      {
         
        id: "1",
       name : "Alabama",
        capital : "Montgomery",
        leader : "Kay Ivey",
        flag : "Alabama_flag.jpg",
        landmarks : [
          "USS1",
          "USS2"
        ],
        ancestorRegion : "1"
      },
      {
         
        id: "2",
        name : "Alaska",
        capital : "Juneau",
        leader : "Mike Dunleavy",
        flag : "Alaska_flag.jpg",
        landmarks : [
          "Anchorage Museum"
        ],
        ancestorRegion : 1
      },
      {
         
        id: "3",
       name : "Arizona",
        capital : "Phoneix",
        leader : "Doug Ducey",
        flag : "Arizona_flag.jpg",
        landmarks : [
          "Grand Canyon"
        ],
        ancestorRegion : 1
      },
      {
         
        id: "4",
       name : "Arkansas",
        capital : "Little Rock",
        leader : "Asa Hutchinson",
        flag : "Arkansas_flag.jpg",
        landmarks : [
          "Hot Spring National Park"
        ],
        ancestorRegion : "1"
      },
      {
         
        id: "5",
       name : "California",
        capital : "Saccramento",
        leader : "Gavin Newsorn",
        flag : "California_flag.jpg",
        landmarks : [
          "Golden Gate Bridge"
        ],
        ancestorRegion : "1"
      }
    ]
  },
]
  

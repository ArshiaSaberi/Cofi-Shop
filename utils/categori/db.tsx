export interface Category {
  id: number;
  name: string;
  src: string;
  link: string;
}

export const productCategories: Category[] = [
  {
    id: 1,
    name: "اکسسوری",
    src: "/fill-font-img-svg-icon/images/danah.png",
    link: "/products/%20?catagory=%D8%A7%D9%86%D9%88%D8%A7%D8%B9+%D8%A7%DA%A9%D8%B3%D8%B3%D9%88%D8%B1%DB%8C",
  },
  {
    id: 2,
    name: "سیروپ",
    src: "/fill-font-img-svg-icon/images/podre.png",
    link: "/products/%20?catagory=%D8%B3%DB%8C%D8%B1%D9%88%D9%BE+%D9%87%D8%A7",
  },
  {
    id: 3,
    name: "دریپ بک",
    src: "/fill-font-img-svg-icon/images/drip.jpg",
    link: "/products/%20?catagory=%D8%AF%D8%B1%DB%8C%D9%BE+%D8%A8%DA%A9",
  },
  {
    id: 4,
    name: "پودریجات",
    src: "/fill-font-img-svg-icon/images/serop.jpg",
    link: "/products/%20?catagory=%D8%A7%D9%86%D9%88%D8%A7%D8%B9+%D9%BE%D9%88%D8%AF%D8%B1%DB%8C%D8%AC%D8%A7%D8%AA",
  },
  {
    id: 5,
    name: "دانه قهوه",
    src: "/fill-font-img-svg-icon/images/assory.jpg",
    link: "/products/%20?catagory=%D8%A7%D9%86%D9%88%D8%A7%D8%B9+%D9%82%D9%87%D9%88%D9%87",
  },
];

export const name = [
  { name: "انواع قهوه", id: 1 },
  { name: "انواع پودریجات", id: 2 },
  { name: "دریپ بک", id: 3 },
  { name: "سیروپ ها", id: 4 },
  { name: "انواع اکسسوری", id: 5 },
];

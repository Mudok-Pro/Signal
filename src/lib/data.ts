import { PlaceHolderImages, type ImagePlaceholder } from './placeholder-images';

const getImage = (id: string): ImagePlaceholder => {
    const img = PlaceHolderImages.find(p => p.id === id);
    if (!img) {
        // Fallback or error
        return { id: 'fallback', imageUrl: 'https://picsum.photos/seed/fallback/100/100', imageHint: 'placeholder', description: 'fallback' };
    }
    return img;
}

export type Mechanic = {
  id: string;
  name: string;
  name_en: string;
  rating: number;
  reviews: number;
  distance: number;
  available: boolean;
  avatar: ImagePlaceholder;
};

export type JobRequest = {
  id: string;
  clientName: string;
  clientName_en: string;
  carModel: string;
  carModel_en: string;
  issue: string;
  issue_en: string;
  location: string;
  location_en: string;
  status: "Pending" | "Accepted" | "In Progress" | "Completed" | "Cancelled";
  status_ar: "قيد الانتظار" | "مقبول" | "قيد التنفيذ" | "مكتمل" | "ملغى";
  createdAt: string;
};

export const mechanics: Mechanic[] = [
  {
    id: "1",
    name: "ورشة أحمد للسيارات",
    name_en: "Ahmed's Auto Shop",
    rating: 4.8,
    reviews: 120,
    distance: 2.5,
    available: true,
    avatar: getImage('mech1')
  },
  {
    id: "2",
    name: "مركز خالد لصيانة المركبات",
    name_en: "Khalid's Vehicle Center",
    rating: 4.5,
    reviews: 85,
    distance: 4.1,
    available: false,
    avatar: getImage('mech2')
  },
  {
    id: "3",
    name: "خبراء السرعة",
    name_en: "Speed Experts",
    rating: 4.9,
    reviews: 210,
    distance: 5.0,
    available: true,
    avatar: getImage('mech3')
  },
  {
    id: "4",
    name: "تصليح فوري",
    name_en: "Instant Repair",
    rating: 4.2,
    reviews: 45,
    distance: 7.2,
    available: true,
    avatar: getImage('mech4')
  },
];

export const jobRequests: JobRequest[] = [
  {
    id: "job1",
    clientName: "فاطمة علي",
    clientName_en: "Fatima Ali",
    carModel: "تويوتا كامري 2022",
    carModel_en: "Toyota Camry 2022",
    issue: "مشكلة في المحرك، يصدر دخان أبيض",
    issue_en: "Engine issue, white smoke emitting",
    location: "شارع الملك فهد، الرياض",
    location_en: "King Fahd Road, Riyadh",
    status: "Pending",
    status_ar: "قيد الانتظار" ,
    createdAt: "2024-07-29T10:00:00Z",
  },
  {
    id: "job2",
    clientName: "عمر خالد",
    clientName_en: "Omar Khalid",
    carModel: "هوندا أكورد 2020",
    carModel_en: "Honda Accord 2020",
    issue: "تغيير زيت وفحص عام",
    issue_en: "Oil change and general check-up",
    location: "حي العليا، الرياض",
    location_en: "Olaya District, Riyadh",
    status: "Accepted",
    status_ar: "مقبول",
    createdAt: "2024-07-29T09:30:00Z",
  },
];

export const myRequests: JobRequest[] = [
    {
        id: "myjob1",
        clientName: "أنا",
        clientName_en: "Me",
        carModel: "هيونداي إلنتra 2021",
        carModel_en: "Hyundai Elantra 2021",
        issue: "البطارية لا تعمل",
        issue_en: "Battery is not working",
        location: "موقعي الحالي",
        location_en: "My current location",
        status: "In Progress",
        status_ar: "قيد التنفيذ",
        createdAt: "2024-07-29T11:00:00Z",
    },
    {
        id: "myjob2",
        clientName: "أنا",
        clientName_en: "Me",
        carModel: "فورد إكسبلورر 2019",
        carModel_en: "Ford Explorer 2019",
        issue: "صوت غريب من المكابح",
        issue_en: "Strange noise from brakes",
        location: "موقعي الحالي",
        location_en: "My current location",
        status: "Completed",
        status_ar: "مكتمل",
        createdAt: "2024-07-28T15:00:00Z",
    }
];

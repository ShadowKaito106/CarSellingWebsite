'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { endpoints } from '@/config/api'

// Định nghĩa kiểu dữ liệu theo cấu trúc mới từ API
interface Vehicle {
  vehicle_id: number;
  title: string;
  price: number;
  year: number;
  mileage: number;
  images: string[];
  description?: string;
  location: string;
  condition?: string;
  features?: string[];
  status?: 'available' | 'sold' | 'reserved';
  user: {
    user_id: number;
    full_name: string;
    phone_number: string;
  };
}

// Component hiển thị thumbnail
function ImageThumbnails({ 
  images, 
  selectedImage, 
  onSelect 
}: { 
  images: string[]; 
  selectedImage: string; 
  onSelect: (img: string) => void 
}) {
  if (!images || images.length <= 1) return null;
  
  return (
    <div className="grid grid-cols-4 gap-2 mt-2">
      {images.map((img, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(img)}
          className={`relative w-full aspect-square overflow-hidden rounded-md ${
            selectedImage === img ? 'ring-2 ring-indigo-500' : ''
          }`}
        >
          <Image
            src={img}
            alt={`Thumbnail ${idx + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 25vw, 150px"
          />
        </button>
      ))}
    </div>
  );
}

// Component hiển thị tính năng
function FeaturesList({ features }: { features: string[] }) {
  if (!features || features.length === 0) return null;
  
  return (
    <div className="mt-6">
      <h4 className="text-md font-medium text-gray-900">Tính năng:</h4>
      <ul className="mt-2 grid grid-cols-1 gap-y-1 sm:grid-cols-2 list-disc pl-4 text-sm text-gray-600">
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </div>
  );
}

// Component hiển thị thông tin chi tiết xe
function VehicleInfo({ vehicle }: { vehicle: Vehicle }) {
  // Định dạng giá theo tiền Việt Nam
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  // Xác định màu sắc cho trạng thái xe
  const statusColor = vehicle.status ? {
    available: 'bg-green-100 text-green-800',
    sold: 'bg-red-100 text-red-800',
    reserved: 'bg-yellow-100 text-yellow-800',
  }[vehicle.status] : 'bg-green-100 text-green-800';

  return (
    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {vehicle.title}
        </h1>
        {vehicle.status && (
          <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium ${statusColor}`}>
            {vehicle.status === 'available' ? 'Còn hàng' : 
             vehicle.status === 'sold' ? 'Đã bán' : 'Đã đặt cọc'}
          </span>
        )}
      </div>

      <div className="mt-3">
        <h2 className="sr-only">Thông tin giá</h2>
        <p className="text-3xl font-bold tracking-tight text-red-600">{formatPrice(vehicle.price)}</p>
      </div>

      {vehicle.description && (
        <div className="mt-6">
          <h3 className="sr-only">Mô tả</h3>
          <div className="space-y-6 text-base text-gray-700">{vehicle.description}</div>
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 pt-8">
        <h3 className="text-lg font-medium text-gray-900">Thông tin chi tiết</h3>

        <div className="mt-4 grid grid-cols-1 gap-y-3 sm:grid-cols-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Năm sản xuất:</span> {vehicle.year}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Số km:</span> {vehicle.mileage.toLocaleString()} km
          </p>
          {vehicle.condition && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Tình trạng:</span> {vehicle.condition}
            </p>
          )}
          <p className="text-sm text-gray-600">
            <span className="font-medium">Khu vực:</span> {vehicle.location}
          </p>
        </div>
        
        <FeaturesList features={vehicle.features || []} />
      </div>

      <div className="mt-8 border-t border-gray-200 pt-8">
        <h3 className="text-lg font-medium text-gray-900">Thông tin người bán</h3>
        <div className="mt-4 grid grid-cols-1 gap-y-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Tên:</span> <span className="font-bold text-blue-600">{vehicle.user.full_name}</span>
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Số điện thoại:</span> {vehicle.user.phone_number}
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={() => window.location.href = `tel:${vehicle.user.phone_number}`}
          className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Gọi điện
        </button>
        <button
          type="button"
          onClick={() => window.location.href = `sms:${vehicle.user.phone_number}`}
          className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Nhắn tin
        </button>
      </div>
    </div>
  );
}

// Component chính
export default function VehicleDetail() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Sử dụng React Query để quản lý data fetching
  const { data: vehicle, error, isLoading } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      try {
        const response = await axios.get(endpoints.vehicles.detail(id as string));
        const data = response.data;
        
        // Đặt ảnh đầu tiên là ảnh được chọn
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
        
        return data as Vehicle;
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 phút
  });

  // Xử lý lỗi từ React Query
  useEffect(() => {
    if (error) {
      toast.error('Không thể tải thông tin xe. Vui lòng thử lại sau.');
    }
  }, [error]);

  // Hiển thị loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Hiển thị thông báo nếu không tìm thấy xe
  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Không tìm thấy xe</h2>
          <p className="mt-2 text-gray-600">Xe bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-16 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Phần hiển thị ảnh */}
          <div className="flex flex-col">
            <div className="relative aspect-h-9 aspect-w-16 overflow-hidden rounded-lg mb-4">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={vehicle.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
                  priority
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200">
                  <p className="text-gray-500">Không có ảnh</p>
                </div>
              )}
            </div>

            <ImageThumbnails 
              images={vehicle.images || []} 
              selectedImage={selectedImage} 
              onSelect={setSelectedImage} 
            />
          </div>

          {/* Thông tin chi tiết xe */}
          <VehicleInfo vehicle={vehicle} />
        </div>
      </div>
    </div>
  );
} 
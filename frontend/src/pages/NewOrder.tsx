
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { OrderForm } from '@/components/orders/OrderForm';
import { useParams } from 'react-router-dom';

const NewOrder = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const [editingOrder, setEditingOrder] = useState(null);

  return (
    <MainLayout>
      <PageHeader
        title="New Order"
        subtitle="Create a new delivery order"
      />

      <div className="grid grid-cols-1 gap-6">
        {/* Order Form Section */}
        <div className="p-6 shadow-sm">
          <OrderForm onFormChange={(data) => console.log('Form data changed:', data)} />
        </div>
      </div>
    </MainLayout>
  );
};

export default NewOrder;

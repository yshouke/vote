import { Table, Popconfirm, Button } from 'antd';

const ProductList: React.FC<{ products: { id: string }[]; onDelete: (id: string) => void }> = ({
  onDelete,
  products,
}) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Actions',
      render: (_text: any, record: { id: string; }) => {
        return (
          <Popconfirm title="Delete?" onConfirm={() => onDelete(record.id)}>
            <Button>Delete</Button>
          </Popconfirm>
        );
      },
    },
  ];
  return <Table dataSource={products} columns={columns} />;
};

export default ProductList;
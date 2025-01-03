import ProviderTheme from "@/styles/providerTheme";
import { LineGetDetails } from "@/types/lineDetails";
import { Card, Group, Paper, SegmentedControl, Stack, Text } from "@mantine/core";
import { useState } from "react";
import LineList from "./lineList";
import { CategoryGetDetails } from "@/types/categoryDetails";
import CategoryList from "./categoryList";
import { ProductGetDetails } from "@/types/productDetails";
import ProductList from "./productList";

interface Props {
  lines: LineGetDetails[];
  categories: CategoryGetDetails[];
  products: ProductGetDetails[];
}

export default function PageProdutos({ lines, categories, products }: Props) {
  const { isDesktop } = ProviderTheme();
  const [tabContent, setTabContent] = useState<'products' | 'categories' | 'lines'>('products');

  return (
    <>
      <Stack h='100%' align="center" >
        <Paper w='100%'>
          <Card withBorder p="md" radius="md">
            <Group m='auto' gap={isDesktop ? '30' : '10'} justify="center">
              <Stack gap={5}>
                <Text size="lg">
                  Resumo dos produtos
                </Text>
                <Group>
                  <Stack gap={0}>
                    <Text size="lg">{products.length}</Text>
                    <Text fz="xs" c="dimmed">Produtos</Text>
                  </Stack>
                  <Stack gap={0}>
                    <Text size="lg">{categories.length}</Text>
                    <Text fz="xs" c="dimmed">Categorias</Text>
                  </Stack>
                  <Stack gap={0}>
                    <Text size="lg">{lines.length}</Text>
                    <Text fz="xs" c="dimmed">Linhas</Text>
                  </Stack>
                </Group>
              </Stack>
            </Group>
          </Card>
        </Paper>
        <Paper w={isDesktop ? '80%' : '100%'} h='100%'>
          <SegmentedControl
            mb='md'
            color="red"
            fullWidth
            withItemsBorders={false}
            value={tabContent}
            onChange={(value) => setTabContent(value as 'products' | 'categories' | 'lines')}
            data={[
              { value: 'products', label: 'Produtos' },
              { value: 'categories', label: 'Categorias' },
              { value: 'lines', label: 'Linhas' },
            ]}
          />
          {tabContent === 'products' && <ProductList products={products} />}
          {tabContent === 'categories' && <CategoryList categories={categories} />}
          {tabContent === 'lines' && <LineList lines={lines} />}
        </Paper>
      </Stack >
    </>
  )
}

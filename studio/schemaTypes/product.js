import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Produk Say Macaroni',
  type: 'document',
  fields: [
    defineField({
      name: 'nama',
      title: 'Nama Produk',
      type: 'string',
      validation: (Rule) => Rule.required().error('Nama produk wajib diisi'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'nama',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('Slug wajib diisi'),
    }),
    defineField({
      name: 'varian_rasa',
      title: 'Varian Rasa',
      type: 'string',
      description: 'Contoh: Garlic Butter, Original, Balado, Keju',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'level_pedas',
      title: 'Level Pedas Tersedia',
      type: 'array',
      of: [{ type: 'number' }],
      description: 'Pilihan level pedas (contoh: 0, 1, 2, 3, 4, 5)',
      initialValue: [0, 1, 2, 3, 4, 5],
    }),
    defineField({
      name: 'harga',
      title: 'Harga (Rp)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'berat',
      title: 'Berat Kemasan',
      type: 'string',
      description: 'Contoh: 150g',
      initialValue: '150g',
    }),
    defineField({
      name: 'stok_tampil',
      title: 'Stok Tampil / Ready',
      type: 'boolean',
      description: 'Matikan jika stok habis agar produk disembunyikan dari katalog',
      initialValue: true,
    }),
    defineField({
      name: 'deskripsi',
      title: 'Deskripsi Produk',
      type: 'text',
    }),
    defineField({
      name: 'komposisi',
      title: 'Komposisi / Bahan Utama',
      type: 'text',
    }),
    defineField({
      name: 'foto',
      title: 'Foto Produk',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Unggah satu atau lebih foto produk',
    }),
    defineField({
      name: 'kategori',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Best Seller', value: 'Best Seller' },
          { title: 'Classic', value: 'Classic' },
          { title: 'Spicy Fusion', value: 'Spicy Fusion' },
          { title: 'Cheese Lover', value: 'Cheese Lover' },
          { title: 'Specialty', value: 'Specialty' },
        ],
      },
    }),
    defineField({
      name: 'unggulan',
      title: 'Produk Unggulan (Featured)',
      type: 'boolean',
      description: 'Tampilkan di banner Halaman Utama',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'nama',
      subtitle: 'harga',
      media: 'foto.0',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Tanpa Nama',
        subtitle: subtitle ? `Rp ${Number(subtitle).toLocaleString('id-ID')}` : '',
        media,
      };
    },
  },
});

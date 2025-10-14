import type { BlogDto, Blog, CreateBlogDto } from './type';

/** BE → UI */
export const mapDtoToUi = (d: BlogDto): Blog => ({
  id: d.blogId,
  accountId: d.accountId,
  authorName: d.authorName,
  title: d.title,
  shortdesc: d.shortdesc ?? null,
  content: d.content,
  imageUrl: d.imageurl ?? null,
  status: d.status ?? null,
  createdAt: d.createdat,
  updatedAt: d.updatedat ?? null,
});

/** UI → BE (cho create/update) */
export const mapUiToDto = (b: Partial<Blog> & { Image?: File }): CreateBlogDto => ({
  Title: b.title ?? '',
  Shortdesc: b.shortdesc ?? '',
  Content: b.content ?? '',
  Status: b.status ?? 'Draft',
  Image: b.Image,
});
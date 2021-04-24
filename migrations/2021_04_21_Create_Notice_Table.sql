create table notice (
	id int4 not null generated always as identity,
	title bpchar(50) NOT NULL,
	body bpchar(240) NOT NULL,
	author_id int4 not null,
	"date" timestamptz NOT NULL,
	subject_id int4 not null,
	constraint notice_pk primary key (id),
	constraint notice_fk_user foreign key (author_id) references public."user"(id),
	constraint notice_fk_subject foreign key (subject_id) references public.subject(id)
);

create table enrollment (
	student_id int4 not null,
	subject_id int4 not null,
	constraint notice_fk_user foreign key (student_id) references public."user"(id),
	constraint notice_fk_subject foreign key (subject_id) references public.subject(id)
);

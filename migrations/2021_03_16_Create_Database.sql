CREATE TABLE public."role" (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"name" bpchar(50) NOT NULL,
    CONSTRAINT role_pk PRIMARY KEY (id)
);

CREATE TABLE public."user" (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"name" bpchar(50) NOT NULL,
	register bpchar(10) NOT NULL,
	"password" bpchar(180) NOT NULL,
	CONSTRAINT user_pk PRIMARY KEY (id),
	CONSTRAINT user_un UNIQUE (register)
);

CREATE TABLE public.user_role (
	user_id int4 NOT NULL,
	role_id int4 NOT NULL,
	CONSTRAINT user_role_un UNIQUE (user_id,role_id),
	CONSTRAINT user_role_fk_user FOREIGN KEY (user_id) REFERENCES public."user"(id),
	CONSTRAINT user_role_fk_role FOREIGN KEY (role_id) REFERENCES public."role"(id)
);

CREATE TABLE public.subject (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"name" bpchar(80) NOT NULL,
	workload int4 NOT NULL,
	professor_id int4 NOT NULL,
	CONSTRAINT subject_pk PRIMARY KEY (id),
	CONSTRAINT subject_un UNIQUE ("name"),
	CONSTRAINT subject_fk FOREIGN KEY (professor_id) REFERENCES public."user"(id)
);

CREATE TABLE public.monitoring (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	subject_id int4 NOT NULL,
	monitor_id int4 NOT NULL,
	CONSTRAINT monitoring_pk PRIMARY KEY (id),
	CONSTRAINT monitoring_un UNIQUE (subject_id,monitor_id),
	CONSTRAINT monitoring_fk_subject FOREIGN KEY (subject_id) REFERENCES public.subject(id),
	CONSTRAINT monitoring_fk_monitor FOREIGN KEY (monitor_id) REFERENCES public."user"(id)
);

create table public.schedule (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	weekday bpchar(20) NOT NULL,
	"begin" timetz(6) NOT NULL,
	"end" timetz(6) NOT NULL,
	monitoring_id int4 NOT NULL,
	CONSTRAINT schedule_pk PRIMARY KEY (id),
	CONSTRAINT schedule_un UNIQUE (weekday,"begin","end",monitoring_id),
	CONSTRAINT schedule_fk FOREIGN KEY (monitoring_id) REFERENCES public.monitoring(id)
);

CREATE TABLE public.appointment (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	"begin" timetz(6) NOT NULL,
	"end" timetz(6) NOT NULL,
	student_id int4 NOT NULL,
	schedule_id int4 NOT NULL,
	CONSTRAINT appointment_pk PRIMARY KEY (id),
	CONSTRAINT appointment_un UNIQUE ("begin","end",schedule_id),
	CONSTRAINT appointment_fk_student FOREIGN KEY (student_id) REFERENCES public."user"(id),
	CONSTRAINT appointment_fk_schedule FOREIGN KEY (schedule_id) REFERENCES public.schedule(id)
);

INSERT INTO public."role"
	("name")
VALUES('Student');

INSERT INTO public."role"
	("name")
VALUES('Monitor');

INSERT INTO public."role"
	("name")
VALUES('Professor');

INSERT INTO public."role"
	("name")
VALUES('Admin');

-- CreateTable
CREATE TABLE "users" (
    "uid" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "email" TEXT NOT NULL,
    "gender" VARCHAR(15),
    "phone" VARCHAR(32),
    "password" TEXT NOT NULL,
    "photo_url" TEXT,
    "name_badge" VARCHAR(150),
    "status" BOOLEAN NOT NULL DEFAULT false,
    "role_id" TEXT NOT NULL,
    "email_verificated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "register_user" BOOLEAN NOT NULL DEFAULT false,
    "delete_user" BOOLEAN NOT NULL DEFAULT false,
    "edit_user" BOOLEAN NOT NULL DEFAULT false,
    "view_user" BOOLEAN NOT NULL DEFAULT false,
    "register_event" BOOLEAN NOT NULL DEFAULT false,
    "delete_event" BOOLEAN NOT NULL DEFAULT false,
    "edit_event" BOOLEAN NOT NULL DEFAULT false,
    "view_event" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "states" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "zipcode" VARCHAR(8) NOT NULL,
    "state_id" TEXT NOT NULL,
    "is_available_event" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "street" VARCHAR(150) NOT NULL,
    "reference" VARCHAR(150),
    "neighborhood" VARCHAR(150) NOT NULL,
    "city_id" TEXT NOT NULL,
    "latitude" TEXT,
    "longitude" TEXT,
    "address_link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_has_addresses" (
    "user_id" TEXT NOT NULL,
    "address_id" TEXT NOT NULL,

    CONSTRAINT "users_has_addresses_pkey" PRIMARY KEY ("user_id","address_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_has_addresses_user_id_key" ON "users_has_addresses"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_has_addresses_address_id_key" ON "users_has_addresses"("address_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_has_addresses" ADD CONSTRAINT "users_has_addresses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_has_addresses" ADD CONSTRAINT "users_has_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

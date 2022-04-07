CREATE TABLE `order` (
  `id`              BIGINT NOT NULL AUTO_INCREMENT,
  `no`              CHAR(12) UNIQUE     NOT NULL,
  `vendor`          VARCHAR(40)  NOT NULL,
  `approval_value`  VARCHAR(100) NOT NULL,
  `pay_state`       BOOLEAN      NOT NULL DEFAULT 0,
  `takeout`         BOOLEAN      NOT NULL DEFAULT 0,
  `created_at`      TIMESTAMP     NOT NULL,
  `updated_at`      TIMESTAMP     NOT NULL,
  `canceled_at`     TIMESTAMP     NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `order_item` (
  `id`        BIGINT NOT NULL AUTO_INCREMENT, 
  `order_no`  CHAR(12) NOT NULL,
  `menu`      NVARCHAR(40) NOT NULL,
  `amount`    TINYINT NOT NULL,
  `price`     MEDIUMINT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`order_no`) REFERENCES `order`(`no`)
);
CREATE TABLE `order` (
  `no`            CHAR(12)     NOT NULL,
  `vendor`        VARCHAR(40)  NOT NULL,
  `approval_value` VARCHAR(100) NOT NULL,
  `pay_state`     BOOLEAN      NOT NULL DEFAULT 0,
  `takeout`       BOOLEAN      NOT NULL DEFAULT 0,
  `created_at`     DATETIME     NOT NULL,
  `updated_at`     DATETIME     NOT NULL,
  PRIMARY KEY (`no`)
);

CREATE TABLE `order_item` (
  `order_no`  CHAR(12) NOT NULL,
  `menu`      NVARCHAR(40) NOT NULL,
  `amount`    TINYINT NOT NULL,
  `price`     MEDIUMINT NOT NULL,
  FOREIGN KEY (`order_no`) REFERENCES `order`(`no`)
);
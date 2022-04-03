CREATE TABLE Orders (
  `id`            INT          NOT NULL AUTO_INCREMENT,
  `order`         TEXT         NOT NULL,
  `vendor`        VARCHAR(40)  NOT NULL,
  `approvalValue` VARCHAR(100) NOT NULL,
  `takeout`       BOOLEAN      NOT NULL DEFAULT 0,
  `createdAt`     DATETIME     NOT NULL,
  `updatedAt`     DATETIME     NOT NULL,
  PRIMARY KEY (id)
);
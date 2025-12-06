CREATE DEFINER=`root`@`localhost` PROCEDURE `LoadAllCars`()
BEGIN
	SELECT brand, model
    FROM car;
END
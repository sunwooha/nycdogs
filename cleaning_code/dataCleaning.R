# load in data
dogs <- read_csv("dogNames.csv")

# filtering the unknowns
dogs_part2 <- dogs %>%
  select(AnimalName, AnimalGender, AgeAsOf2015, BreedName, Borough) %>%
  filter(AnimalName != "UNKNOWN" & BreedName != "UNKNOWN" & AnimalName != "NAME NOT PROVIDED" & AnimalGender != "NULL" &
           Borough != "NULL" & AnimalName != "NULL", BreedName != "Unknown")

# formatting the borough names
formatBorough <- function(x){
  x <- tolower(x)
  s <- strsplit(x, " ")[[1]]
  paste(toupper(substring(s, 1, 1)), substring(s, 2), sep="", collapse = " ")
}

# make sure we only have 5 boroughs
dogs_part2$Borough <- sapply(dogs_part2$Borough, formatBorough)

# data frame that contains the count of all the names in each borough
names_borough_count <- dogs_part2 %>%
  group_by(Borough, AnimalName) %>%
  count()

# data frame that contains the count of all the breeds in each borough
breeds_borough_count <- dogs_part2 %>%
  group_by(Borough, BreedName) %>%
  count()

# data frame that contains the count of the ages of the dogs in each borough
age_distribution <- dogs_part2 %>%
  group_by(Borough, AgeAsOf2015) %>%
  count()

# data frame that contains the count of all the names in each breed
names_breed_count <- dogs_part2 %>%
  group_by(BreedName, AnimalName) %>%
  count()

# top 10 names for each borough
top_10_popular_names_borough <- names_borough_count %>%
  group_by(Borough) %>%
  top_n(n = 10, wt = n)

# top 10 names for each breed
top_10_popular_names_breed <- names_breed_count %>%
  group_by(BreedName) %>%
  top_n(n = 10, wt = n)
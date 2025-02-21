class Investment < ApplicationRecord
  include Accountable

  SUBTYPES = [
    [ "Brokerage", "brokerage" ],
    [ "Pension", "pension" ],
    [ "Retirement", "retirement" ],
    [ "Mutual Fund", "mutual_fund" ],
    [ "Angel", "angel" ],
    [ "Fixed deposit", "fixed_deposit" ],
    [ "Savings account with interest", "savings_account_with_interest" ],
    [ "Other", "other" ]
  ].freeze

  class << self
    def color
      "#1570EF"
    end

    def classification
      "asset"
    end

    def icon
      "line-chart"
    end
  end
end
